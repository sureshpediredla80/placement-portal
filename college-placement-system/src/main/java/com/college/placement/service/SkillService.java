package com.college.placement.service;

import com.college.placement.dto.request.SkillRequest;
import com.college.placement.dto.response.SkillResponse;
import com.college.placement.entity.Skill;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class handling global standardized Skill taxonomy actions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SkillService {

    private final SkillRepository skillRepository;

    /**
     * Registers a new skill in the system.
     *
     * @param request the skill details
     * @return the mapped SkillResponse DTO
     */
    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        log.info("Attempting to create skill with name: {}", request.getName());
        String nameTrimmed = request.getName().trim();
        if (skillRepository.existsByName(nameTrimmed)) {
            throw new BadRequestException("Skill with name '" + nameTrimmed + "' already exists.");
        }

        Skill skill = Skill.builder()
                .name(nameTrimmed)
                .description(request.getDescription() != null ? request.getDescription().trim() : "")
                .build();

        Skill savedSkill = skillRepository.save(skill);
        log.info("Successfully created skill with ID: {}", savedSkill.getId());
        return mapToSkillResponse(savedSkill);
    }

    /**
     * Retrieves all skills from the taxonomy list.
     *
     * @return list of SkillResponse DTOs
     */
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {
        log.info("Fetching all standardized skills");
        return skillRepository.findAll().stream()
                .map(this::mapToSkillResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a skill by ID.
     *
     * @param id the skill ID
     * @return the SkillResponse DTO
     */
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long id) {
        log.info("Fetching skill by ID: {}", id);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));
        return mapToSkillResponse(skill);
    }

    /**
     * Deletes a skill by ID.
     *
     * @param id the skill ID to delete
     */
    @Transactional
    public void deleteSkill(Long id) {
        log.info("Attempting to delete skill with ID: {}", id);
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));
        skillRepository.delete(skill);
        log.info("Successfully deleted skill with ID: {}", id);
    }

    // ============================================================
    // MAPPER
    // ============================================================

    private SkillResponse mapToSkillResponse(Skill skill) {
        if (skill == null) {
            return null;
        }
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .build();
    }
}
