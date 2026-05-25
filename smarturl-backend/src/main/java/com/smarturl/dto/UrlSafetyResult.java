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
public class UrlSafetyResult {

    private String riskLevel;
    private boolean safe;
    private List<String> warnings;
    private List<SecurityCheck> checks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SecurityCheck {
        private String name;
        private boolean passed;
        private String message;
    }
}
