package com.college.placement.controller;

import com.college.placement.dto.request.SkillRequest;
import com.college.placement.dto.response.SkillResponse;
import com.college.placement.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

/**
 * REST Controller exposing global standardized skill taxonomy APIs.
 */
@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "SkillController", description = "APIs for SkillController")
public class SkillController {

    private final SkillService skillService;

    /**
     * Retrieves all standardized skills from the system taxonomy list.
     * Accessible by students, coordinators, and administrators.
     *
     * @return ResponseEntity with the list of skills and HTTP 200 OK
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getAllSkills")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        log.info("REST request to fetch all standardized skills");
        List<SkillResponse> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    /**
     * Fetches detailed skill information by skill ID.
     *
     * @param id the skill ID
     * @return ResponseEntity with skill details and HTTP 200 OK
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getSkillById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<SkillResponse> getSkillById(@PathVariable("id") Long id) {
        log.info("REST request to fetch skill by ID: {}", id);
        SkillResponse response = skillService.getSkillById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Registers a new standard skill in the system taxonomy.
     * Restricted to coordinators and administrators.
     *
     * @param request the skill details DTO
     * @return ResponseEntity with created SkillResponse and HTTP 201 Created
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Post  createSkill")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody SkillRequest request) {
        log.info("REST request to create skill: {}", request.getName());
        SkillResponse response = skillService.createSkill(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Deletes a skill from the system taxonomy.
     * Restricted to administrators only.
     *
     * @param id the skill ID to delete
     * @return ResponseEntity with HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete deleteSkill")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteSkill(@PathVariable("id") Long id) {
        log.info("REST request to delete skill ID: {}", id);
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
