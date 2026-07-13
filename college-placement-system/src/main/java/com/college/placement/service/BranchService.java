package com.college.placement.service;

import com.college.placement.dto.request.BranchRequest;
import com.college.placement.dto.response.BranchResponse;
import com.college.placement.entity.Branch;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class handling CRUD operations for academic branches.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BranchService {

    private final BranchRepository branchRepository;

    /**
     * Registers a new academic branch in the system.
     *
     * @param request the branch details
     * @return the mapped BranchResponse
     */
    @Transactional
    public BranchResponse createBranch(BranchRequest request) {
        log.info("Attempting to create branch with code: {}", request.getCode());
        if (branchRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Branch with code '" + request.getCode() + "' already exists.");
        }

        Branch branch = Branch.builder()
                .name(request.getName().trim())
                .code(request.getCode().trim().toUpperCase())
                .department(request.getDepartment().trim())
                .build();

        Branch savedBranch = branchRepository.save(branch);
        log.info("Successfully created branch with ID: {}", savedBranch.getId());
        return mapToBranchResponse(savedBranch);
    }

    /**
     * Updates an existing academic branch details.
     *
     * @param id the ID of the branch to update
     * @param request the updated branch properties
     * @return the updated BranchResponse
     */
    @Transactional
    public BranchResponse updateBranch(Long id, BranchRequest request) {
        log.info("Attempting to update branch with ID: {}", id);
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with ID: " + id));

        String newCode = request.getCode().trim().toUpperCase();
        if (!branch.getCode().equalsIgnoreCase(newCode) && branchRepository.existsByCode(newCode)) {
            throw new BadRequestException("Branch with code '" + newCode + "' already exists.");
        }

        branch.setName(request.getName().trim());
        branch.setCode(newCode);
        branch.setDepartment(request.getDepartment().trim());

        Branch updatedBranch = branchRepository.save(branch);
        log.info("Successfully updated branch with ID: {}", id);
        return mapToBranchResponse(updatedBranch);
    }

    /**
     * Deletes an academic branch by ID.
     *
     * @param id the ID of the branch to delete
     */
    @Transactional
    public void deleteBranch(Long id) {
        log.info("Attempting to delete branch with ID: {}", id);
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with ID: " + id));
        branchRepository.delete(branch);
        log.info("Successfully deleted branch with ID: {}", id);
    }

    /**
     * Retrieves academic branch details by ID.
     *
     * @param id the branch ID
     * @return the BranchResponse
     */
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        log.info("Fetching branch by ID: {}", id);
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with ID: " + id));
        return mapToBranchResponse(branch);
    }

    /**
     * Retrieves all branches registered in the system.
     *
     * @return list of BranchResponse DTOs
     */
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        log.info("Fetching all academic branches");
        return branchRepository.findAll().stream()
                .map(this::mapToBranchResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // MAPPER
    // ============================================================

    private BranchResponse mapToBranchResponse(Branch branch) {
        if (branch == null) {
            return null;
        }
        return BranchResponse.builder()
                .id(branch.getId())
                .name(branch.getName())
                .code(branch.getCode())
                .department(branch.getDepartment())
                .build();
    }
}
