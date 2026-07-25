package com.college.placement.resume.service;

import com.college.placement.ai.model.AIRequest;
import com.college.placement.ai.model.AIResponse;
import com.college.placement.ai.provider.AIProvider;
import com.college.placement.resume.dto.ResumeGenerationRequest;
import com.college.placement.resume.prompt.ResumePromptBuilder;
import org.springframework.stereotype.Service;

@Service
public class ResumeGenerationService {

    private final AIProvider aiProvider;

    private final ResumePromptBuilder promptBuilder;

    public ResumeGenerationService(
            AIProvider aiProvider,
            ResumePromptBuilder promptBuilder
    ) {

        this.aiProvider = aiProvider;
        this.promptBuilder = promptBuilder;

    }

    public String generateResume(
            ResumeGenerationRequest request
    ) {

        System.out.println("Step 1 : Request received");
        System.out.println("================================");
        System.out.println("PROJECTS FROM REQUEST");
        System.out.println(request.getProjects());
        System.out.println("================================");
        String prompt = promptBuilder.buildPrompt(request);
        System.out.println(prompt);
        System.out.println("Step 2 : Prompt built");
        System.out.println("========== PROMPT ==========");
        System.out.println(prompt);
        System.out.println("============================");
        AIRequest aiRequest = new AIRequest(prompt);

        System.out.println("Step 3 : Calling Gemini");

        AIResponse response = aiProvider.generateContent(aiRequest);

        System.out.println("Step 4 : Gemini Response Received");

        return response.getContent();
    }

}