package com.college.placement.ai.provider;

import com.college.placement.ai.model.AIRequest;
import com.college.placement.ai.model.AIResponse;

public interface AIProvider {

    AIResponse generateContent(AIRequest request);

}