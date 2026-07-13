package com.college.placement.service;

import com.college.placement.dto.response.BulkUploadFailure;
import com.college.placement.dto.response.BulkUploadResponse;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.college.placement.dto.request.UserCreateRequest;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.Branch;
import com.college.placement.entity.CoordinatorProfile;
import com.college.placement.entity.PlacementStatus;
import com.college.placement.entity.Role;
import com.college.placement.entity.StudentProfile;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.BranchRepository;
import com.college.placement.repository.CoordinatorProfileRepository;
import com.college.placement.repository.StudentProfileRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.*;
import org.springframework.core.io.ByteArrayResource;

import java.io.ByteArrayOutputStream;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
/**
 * Service layer for managing {@link User} entities in the College Placement Management System.
 *
 * <p>This service provides administrative operations for user management, including creation
 * of students, coordinators, and administrators, as well as activation and deactivation
 * of accounts. It automatically creates and links the corresponding profiles (e.g.,
 * {@link StudentProfile}, {@link CoordinatorProfile}) when a user is created.</p>
 */
@Service
@Transactional(readOnly = true)
public class UserManagementService {

    private static final Logger log = LoggerFactory.getLogger(UserManagementService.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(UserRepository userRepository,
                                 StudentProfileRepository studentProfileRepository,
                                 CoordinatorProfileRepository coordinatorProfileRepository,
                                 BranchRepository branchRepository,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ============================================================
    // CREATE USER
    // ============================================================

    /**
     * Creates a new user in the system along with their corresponding profile based on role.
     *
     * <p>A temporary password ("Welcome@123") is generated and encrypted. For students and
     * coordinators, a branch ID is required to link them to an academic department. Default
     * values are initialized for student profiles.</p>
     *
     * @param request the {@link UserCreateRequest} containing user details
     * @return a {@link UserResponse} representing the newly created user
     * @throws BadRequestException       if validation fails (e.g., email exists, missing branch)
     * @throws ResourceNotFoundException if the specified branch is not found
     */
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        log.info("Creating new user with email: {} and role: {}", request.getEmail(), request.getRole());

        // ── Validations ───────────────────────────────────────────────────────
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new BadRequestException("Full name must not be blank.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email must not be blank.");
        }
        if (request.getRole() == null) {
            throw new BadRequestException("Role is mandatory.");
        }


        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered: " + email);
        }

        // ── Generate User ─────────────────────────────────────────────────────
        String defaultPassword = "Welcome@123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(encodedPassword)
                .role(request.getRole())
                .isActive(true)
                .build();
        User savedUser = userRepository.save(user);

        // ── Handle Profiles based on Role ─────────────────────────────────────
        if (request.getRole() == Role.ROLE_STUDENT) {
            if (request.getRollNumber() == null ||
                    request.getRollNumber().isBlank()) {

                throw new BadRequestException(
                        "Roll number is required."
                );
            }

            if (request.getYear() == null) {

                throw new BadRequestException(
                        "Year is required."
                );
            }

            if (request.getYear() < 1 ||
                    request.getYear() > 4) {

                throw new BadRequestException(
                        "Year must be between 1 and 4."
                );
            }

            if (request.getBranchId() == null) {
                throw new BadRequestException("Branch ID is mandatory for STUDENT role.");
            }
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

            StudentProfile studentProfile = StudentProfile.builder()
                    .user(savedUser)
                    .branch(branch)
                    .rollNumber(request.getRollNumber())
                    .year(request.getYear())
                    .cgpa(0.0)
                    .placementStatus(PlacementStatus.NOT_PREPARED)
                    .graduated(false)
                    .phone(null)
                    .githubLink(null)
                    .linkedinLink(null)
                    .resumeUrl(null)
                    .build();

            studentProfileRepository.save(studentProfile);
            log.info("Student profile created for user ID: {}", savedUser.getId());

        } else if (request.getRole() == Role.ROLE_COORDINATOR) {
            if (request.getBranchId() == null) {
                throw new BadRequestException("Branch ID is mandatory for COORDINATOR role.");
            }
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

            CoordinatorProfile coordinatorProfile = CoordinatorProfile.builder()
                    .user(savedUser)
                    .branchAssigned(branch)
                    .department(branch.getDepartment())
                    .build();

            coordinatorProfileRepository.save(coordinatorProfile);
            log.info("Coordinator profile created for user ID: {}", savedUser.getId());
        }

        log.info("User created successfully with ID: {}", savedUser.getId());
        return mapToUserResponse(savedUser);
    }

    // ============================================================
    // GET USER BY ID
    // ============================================================

    /**
     * Retrieves a single user by their unique ID.
     *
     * @param userId the ID of the user to retrieve
     * @return a {@link UserResponse} for the requested user
     * @throws ResourceNotFoundException if no user exists with the given ID
     */
    public UserResponse getUserById(Long userId) {
        log.info("Fetching user by id: {}", userId);
        User user = findUserById(userId);
        return mapToUserResponse(user);
    }

    // ============================================================
    // GET ALL USERS
    // ============================================================

    /**
     * Retrieves all users in the system with pagination support.
     *
     * @param pageable pagination and sorting configuration
     * @return a {@link Page} of {@link UserResponse} containing all users
     */
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        log.info("Fetching all users — page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findAll(pageable).map(this::mapToUserResponse);
    }

    // ============================================================
    // GET USERS BY ROLE
    // ============================================================

    /**
     * Retrieves users filtered by their role with pagination support.
     *
     * @param role     the role to filter by
     * @param pageable pagination and sorting configuration
     * @return a {@link Page} of {@link UserResponse} containing users with the specified role
     */
    public Page<UserResponse> getUsersByRole(Role role, Pageable pageable) {
        log.info("Fetching users by role: {} — page: {}, size: {}", role, pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findByRole(role, pageable).map(this::mapToUserResponse);
    }

    // ============================================================
    // ACTIVATE USER
    // ============================================================

    /**
     * Activates a user account, allowing them to log in to the system.
     *
     * @param userId the ID of the user to activate
     * @return the updated {@link UserResponse}
     * @throws ResourceNotFoundException if no user exists with the given ID
     * @throws BadRequestException       if the user is already active
     */
    @Transactional
    public UserResponse activateUser(Long userId) {
        log.info("Activating user with id: {}", userId);
        User user = findUserById(userId);

        if (Boolean.TRUE.equals(user.getIsActive())) {
            log.warn("Activation failed — user id: {} is already active", userId);
            throw new BadRequestException("User is already active.");
        }

        user.setIsActive(true);
        User updated = userRepository.save(user);
        log.info("User id: {} activated successfully.", updated.getId());

        return mapToUserResponse(updated);
    }

    // ============================================================
    // DEACTIVATE USER
    // ============================================================

    /**
     * Deactivates a user account, preventing them from logging in.
     *
     * @param userId the ID of the user to deactivate
     * @return the updated {@link UserResponse}
     * @throws ResourceNotFoundException if no user exists with the given ID
     * @throws BadRequestException       if the user is already inactive
     */
    @Transactional
    public UserResponse deactivateUser(Long userId) {
        log.info("Deactivating user with id: {}", userId);
        User user = findUserById(userId);

        if (Boolean.FALSE.equals(user.getIsActive())) {
            log.warn("Deactivation failed — user id: {} is already inactive", userId);
            throw new BadRequestException("User is already inactive.");
        }

        user.setIsActive(false);
        User updated = userRepository.save(user);
        log.info("User id: {} deactivated successfully.", updated.getId());

        return mapToUserResponse(updated);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Finds a {@link User} entity by its ID.
     *
     * @param id the ID of the user to find
     * @return the found {@link User} entity
     * @throws ResourceNotFoundException if no user exists with the given ID
     */
    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User not found with id: {}", id);
                    return new ResourceNotFoundException("User not found with id: " + id);
                });
    }

    public Page<UserResponse> searchUsersByRole(
            Role role,
            String keyword,
            Pageable pageable
    ) {

        log.info(
                "Searching users. role={}, keyword={}",
                role,
                keyword
        );

        return userRepository
                .searchUsersByRole(
                        role,
                        keyword,
                        pageable
                )
                .map(this::mapToUserResponse);
    }

    /**
     * Maps a {@link User} entity to a {@link UserResponse} DTO.
     *
     * @param user the {@link User} entity to map
     * @return a fully populated {@link UserResponse} DTO
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }


    // ============================================================
    // delect user
    // ============================================================


    @Transactional
    public void deleteUser(Long userId) {

        User user = findUserById(userId);

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentProfileRepository.deleteByUserId(userId);
        }

        if (user.getRole() == Role.ROLE_COORDINATOR) {
            coordinatorProfileRepository.deleteByUserId(userId);
        }

        userRepository.delete(user);

    }


    @Transactional
    public BulkUploadResponse uploadStudents(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Excel file is required.");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.toLowerCase().endsWith(".xlsx")) {
            throw new BadRequestException("Only .xlsx files are supported.");
        }

        int totalRows = 0;
        int successCount = 0;

        List<BulkUploadFailure> failures = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();

            int lastRow = sheet.getLastRowNum();

            for (int i = 1; i <= lastRow; i++) {

                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                boolean emptyRow = true;

                for (int j = 0; j <= 4; j++) {

                    Cell cell = row.getCell(j);

                    if (cell != null &&
                            !formatter.formatCellValue(cell).trim().isEmpty()) {

                        emptyRow = false;
                        break;
                    }
                }

                if (emptyRow) {
                    continue;
                }

                totalRows++;

                try {

                    String fullName =
                            formatter.formatCellValue(row.getCell(0)).trim();

                    String email =
                            formatter.formatCellValue(row.getCell(1)).trim();

                    String branchCode =
                            formatter.formatCellValue(row.getCell(2)).trim();

                    String rollNumber =
                            formatter.formatCellValue(row.getCell(3)).trim();

                    String yearValue =
                            formatter.formatCellValue(row.getCell(4)).trim();

                    Integer year = Integer.parseInt(yearValue);

                    Branch branch = branchRepository
                            .findByCode(branchCode)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Branch not found: " + branchCode
                                    )
                            );

                    UserCreateRequest request = UserCreateRequest.builder()
                            .fullName(fullName)
                            .email(email)
                            .role(Role.ROLE_STUDENT)
                            .branchId(branch.getId())
                            .rollNumber(rollNumber)
                            .year(year)
                            .build();

                    createUser(request);

                    successCount++;

                } catch (Exception ex) {

                    failures.add(
                            BulkUploadFailure.builder()
                                    .rowNumber(i + 1)
                                    .reason(ex.getMessage())
                                    .build()
                    );
                }
            }

        } catch (IOException e) {

            throw new BadRequestException("Unable to read Excel file.");
        }

        return BulkUploadResponse.builder()
                .totalRows(totalRows)
                .successCount(successCount)
                .failureCount(failures.size())
                .failures(failures)
                .build();
    }

    @Transactional(readOnly = true)
    public ByteArrayResource downloadStudentTemplate() {

        try (

                Workbook workbook = new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()

        ) {

            Sheet sheet =
                    workbook.createSheet(
                            "Students"
                    );

            //--------------------------------------------------
            // Header Style
            //--------------------------------------------------

            Font headerFont =
                    workbook.createFont();

            headerFont.setBold(true);

            CellStyle headerStyle =
                    workbook.createCellStyle();

            headerStyle.setFont(headerFont);

            //--------------------------------------------------
            // Header Row
            //--------------------------------------------------

            Row header =
                    sheet.createRow(0);

            String[] columns = {

                    "Full Name",
                    "Email",
                    "Branch Code",
                    "Roll Number",
                    "Year"

            };

            for (int i = 0; i < columns.length; i++) {

                Cell cell =
                        header.createCell(i);

                cell.setCellValue(columns[i]);

                cell.setCellStyle(headerStyle);

                sheet.autoSizeColumn(i);

            }

            //--------------------------------------------------
            // Sample Row
            //--------------------------------------------------

            Row sample =
                    sheet.createRow(1);

            sample.createCell(0)
                    .setCellValue("John Doe");

            sample.createCell(1)
                    .setCellValue("john@gmail.com");

            sample.createCell(2)
                    .setCellValue("CSE");

            sample.createCell(3)
                    .setCellValue("CSE001");

            sample.createCell(4)
                    .setCellValue(3);

            workbook.write(outputStream);

            return new ByteArrayResource(
                    outputStream.toByteArray()
            );

        }
        catch (IOException ex) {

            throw new BadRequestException(
                    "Unable to generate template."
            );

        }

    }
    @Transactional
    public int deactivateGraduatedStudents() {

        List<StudentProfile> students =
                studentProfileRepository
                        .findActiveGraduatedStudents();

        for (StudentProfile student : students) {

            User user = student.getUser();

            user.setIsActive(false);
        }

        userRepository.saveAll(
                students.stream()
                        .map(StudentProfile::getUser)
                        .toList()
        );

        return students.size();
    }
    @Transactional
    public int activateGraduatedStudents() {

        List<StudentProfile> graduates =
                studentProfileRepository.findByGraduatedTrue();

        int activatedCount = 0;

        for (StudentProfile student : graduates) {

            User user = student.getUser();

            if (!Boolean.TRUE.equals(user.getIsActive())) {

                user.setIsActive(true);

                activatedCount++;
            }
        }

        return activatedCount;
    }




}

