package com.college.placement.ai.gemini.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GeminiPart {

    private String text;

    public GeminiPart() {
    }

    public GeminiPart(String text) {
        this.text = text;
    }

}