package com.college.placement.dto.response;

import lombok.*;

/**
 * DTO representing statistical data regarding discussion forum topics.
 *
 * <p>Provides insights into the engagement and volume of topics created globally
 * versus those restricted to the coordinator's specific branch.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicStatisticsResponse {

    /**
     * Total number of topics accessible to the coordinator's branch (both global and branch-specific).
     */
    private Long totalTopics;

    /**
     * Number of topics created with global visibility.
     */
    private Long globalTopics;

    /**
     * Number of topics created specifically for the coordinator's assigned branch.
     */
    private Long branchTopics;
}
