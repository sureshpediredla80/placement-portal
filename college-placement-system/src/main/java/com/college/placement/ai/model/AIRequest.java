package com.college.placement.ai.model;

public class AIRequest {

    private String prompt;

    public AIRequest() {
    }

    public AIRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}