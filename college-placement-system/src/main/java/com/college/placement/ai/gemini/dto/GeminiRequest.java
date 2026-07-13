package com.college.placement.ai.gemini.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GeminiRequest {

    private List<GeminiContent> contents;

    public GeminiRequest() {
    }

    public GeminiRequest(List<GeminiContent> contents) {
        this.contents = contents;
    }

}