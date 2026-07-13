package com.college.placement.ai.gemini.client;
import com.college.placement.ai.config.AIProperties;
import com.college.placement.ai.gemini.dto.GeminiRequest;
import com.college.placement.ai.gemini.dto.GeminiResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class GeminiClient {

    private final RestTemplate restTemplate;
    private final AIProperties aiProperties;
    public GeminiClient(RestTemplate restTemplate, AIProperties aiProperties) {

        this.restTemplate = restTemplate;
        this.aiProperties = aiProperties;

    }
    public GeminiResponse generateContent(
            GeminiRequest request,
            String apiKey
    ) {

        String url =

                aiProperties.getBaseUrl()

                        + "/"

                        + aiProperties.getModel()

                        + ":generateContent?key="

                        + apiKey;

        return restTemplate.postForObject(

                url,

                request,

                GeminiResponse.class

        );

    }

}