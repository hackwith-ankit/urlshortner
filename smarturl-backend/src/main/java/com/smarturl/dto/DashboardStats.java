package com.smarturl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalLinks;
    private long activeLinks;
    private long totalClicks;
    private long uniqueVisitors;
    private long qrCodesGenerated;
    private long spamLinksBlocked;
}
