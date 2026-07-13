package com.college.placement.ai.keymanager;

import java.time.LocalDateTime;

public class ApiKeyStatus {

    private String apiKey;

    private boolean active;

    private int failureCount;

    private LocalDateTime cooldownUntil;

    public ApiKeyStatus(String apiKey) {

        this.apiKey = apiKey;
        this.active = true;
        this.failureCount = 0;
        this.cooldownUntil = null;

    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public LocalDateTime getCooldownUntil() {
        return cooldownUntil;
    }

    public void setCooldownUntil(LocalDateTime cooldownUntil) {
        this.cooldownUntil = cooldownUntil;
    }
    public void markFailed() {

        this.failureCount++;

        this.active = false;

        this.cooldownUntil =
                LocalDateTime.now().plusMinutes(10);

    }

    public void markHealthy() {

        this.failureCount = 0;

        this.active = true;

        this.cooldownUntil = null;

    }

    public boolean isAvailable() {

        if (active) {

            return true;

        }

        if (

                cooldownUntil != null &&

                        LocalDateTime.now().isAfter(cooldownUntil)

        ) {

            active = true;

            cooldownUntil = null;

            return true;

        }

        return false;

    }

}