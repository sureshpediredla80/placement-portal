package com.college.placement.ai.keymanager;

import com.college.placement.ai.config.AIProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ApiKeyManager {

    private final AIProperties aiProperties;

    private final List<ApiKeyStatus> apiKeys = new ArrayList<>();

    private final AtomicInteger currentIndex = new AtomicInteger(0);

    public ApiKeyManager(AIProperties aiProperties) {
        this.aiProperties = aiProperties;
    }

    @PostConstruct
    public void initialize() {

        for (String key : aiProperties.getKeys()) {

            apiKeys.add(new ApiKeyStatus(key));

        }

        System.out.println(
                "Loaded AI Keys : " + apiKeys.size()
        );

    }
    public synchronized ApiKeyStatus getNextAvailableKey() {

        int totalKeys = apiKeys.size();

        for (

                int i = 0;

                i < totalKeys;

                i++

        ) {

            int index =

                    currentIndex.getAndIncrement()

                            % totalKeys;

            ApiKeyStatus key =

                    apiKeys.get(index);

            if (

                    key.isAvailable()

            ) {

                return key;

            }

        }

        throw new RuntimeException(

                "No active AI API Keys available."

        );

    }



}