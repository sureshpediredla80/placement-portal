package com.college.placement.resume.controller;

import com.college.placement.resume.dto.ResumeGenerationRequest;
import com.college.placement.resume.dto.ResumeGenerationResponse;
import com.college.placement.resume.service.ResumeGenerationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class ResumeGenerationController {

    private final ResumeGenerationService resumeGenerationService;

    public ResumeGenerationController(
            ResumeGenerationService resumeGenerationService
    ) {
        this.resumeGenerationService = resumeGenerationService;
    }

    @PostMapping("/generate")
    public ResumeGenerationResponse generateResume(
            @RequestBody ResumeGenerationRequest request
    ) {

        String result =
                resumeGenerationService.generateResume(
                        request
                );

        return new ResumeGenerationResponse(result);

    }

}