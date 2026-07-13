package com.college.placement.controller;

import com.college.placement.dto.response.RateLimitEventResponse;
import com.college.placement.service.RateLimitAuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/rate-limit-events")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Rate Limit Audit",
        description = "Admin APIs for viewing rate limit violations"
)
public class RateLimitAuditController {

    private final RateLimitAuditService rateLimitAuditService;
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all rate limit violations")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<Page<RateLimitEventResponse>> getAllViolations(

            @ParameterObject
            @PageableDefault(
                    size = 10,
                    sort = "blockedAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable

    ) {



        Page<RateLimitEventResponse> response =
                rateLimitAuditService.getAllViolations(pageable);
        log.info(
                "Fetching rate limit violations | page={} size={}",
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Filter violations by date")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/filter")
    public ResponseEntity<Page<RateLimitEventResponse>> filterViolations(

            @RequestParam("start")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam("end")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end,

            @ParameterObject
            @PageableDefault(
                    size = 10,
                    sort = "blockedAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable

    ) {


        log.info(
                "Filtering rate limit violations from {} to {}",
                start,
                end
        );
        return ResponseEntity.ok(

                rateLimitAuditService.getViolationsBetween(
                        start,
                        end,
                        pageable
                )

        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rate limit statistics")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/statistics")
    public ResponseEntity<Long> getStatistics(

            @RequestParam("from")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from

    ) {
        log.info(
                "Fetching rate limit statistics from {}",
                from
        );

        return ResponseEntity.ok(

                rateLimitAuditService.getViolationsSince(from)

        );
    }
}