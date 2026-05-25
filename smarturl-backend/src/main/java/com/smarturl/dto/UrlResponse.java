package com.smarturl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlResponse {

    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String customAlias;
    private String qrCodeData;
    private Boolean isActive;
    private String riskLevel;
    private Long totalClicks;
    private Long uniqueVisitors;
    private String createdAt;
}
