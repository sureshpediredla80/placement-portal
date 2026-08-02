package com.college.placement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkResultUploadResponse {

    private int totalEmails;

    private int selectedCount;

    private int rejectedCount;

    private int notFoundCount;

    private List<String> notFoundEmails;

}