package com.college.placement.ai.gemini.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GeminiContent {

    private List<GeminiPart> parts;

    public GeminiContent() {
    }

    public GeminiContent(List<GeminiPart> parts) {
        this.parts = parts;
    }

}