package com.college.placement.ai.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "ai")
public class AIProperties {

    private String provider;
    private String baseUrl;

    private String model;
    private List<String> keys = new ArrayList<>();

    private Integer timeout;

}