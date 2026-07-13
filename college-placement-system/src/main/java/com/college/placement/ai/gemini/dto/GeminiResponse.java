package com.college.placement.ai.gemini.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GeminiResponse {

    private List<GeminiCandidate> candidates;

    public GeminiResponse() {
    }

}