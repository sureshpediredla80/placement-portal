package com.college.placement.ai.provider;

import com.college.placement.ai.gemini.client.GeminiClient;
import com.college.placement.ai.gemini.dto.GeminiContent;
import com.college.placement.ai.gemini.dto.GeminiPart;
import com.college.placement.ai.gemini.dto.GeminiRequest;
import com.college.placement.ai.gemini.dto.GeminiResponse;
import com.college.placement.ai.keymanager.ApiKeyManager;
import com.college.placement.ai.keymanager.ApiKeyStatus;
import com.college.placement.ai.model.AIRequest;
import com.college.placement.ai.model.AIResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiProvider implements AIProvider {

    private final GeminiClient geminiClient;

    private final ApiKeyManager apiKeyManager;

    public GeminiProvider(
            GeminiClient geminiClient,
            ApiKeyManager apiKeyManager
    ) {

        this.geminiClient = geminiClient;
        this.apiKeyManager = apiKeyManager;

    }

    @Override
    public AIResponse generateContent(AIRequest request) {

        ApiKeyStatus apiKey =
                apiKeyManager.getNextAvailableKey();

        GeminiRequest geminiRequest =
                new GeminiRequest(

                        List.of(

                                new GeminiContent(

                                        List.of(

                                                new GeminiPart(

                                                        request.getPrompt()

                                                )

                                        )

                                )

                        )

                );

        GeminiResponse response =

                geminiClient.generateContent(

                        geminiRequest,

                        apiKey.getApiKey()

                );

        String generatedText =

                response

                        .getCandidates()

                        .get(0)

                        .getContent()

                        .getParts()

                        .get(0)

                        .getText();

        return new AIResponse(generatedText);

    }

}