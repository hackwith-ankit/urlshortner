package com.smarturl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummary {

    private long totalClicks;
    private long uniqueVisitors;
    private List<ClickTrendData> clickTrend;
    private List<DistributionData> browserDistribution;
    private List<DistributionData> deviceDistribution;
    private List<DistributionData> osDistribution;
    private List<DistributionData> countryDistribution;
    private List<DistributionData> referrerDistribution;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ClickTrendData {
        private String date;
        private long clicks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DistributionData {
        private String name;
        private long value;
    }
}
