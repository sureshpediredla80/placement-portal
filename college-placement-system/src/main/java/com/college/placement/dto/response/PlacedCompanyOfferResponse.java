package com.college.placement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Outbound DTO representing a single company job selection offer for a student.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacedCompanyOfferResponse {

    private Long companyId;

    private String companyName;

    private String roleOffered;

    private BigDecimal packageOfferedLpa;

    private LocalDateTime selectionDate;
}
