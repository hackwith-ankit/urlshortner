package com.smarturl.service;

import com.smarturl.dto.AnalyticsSummary;
import com.smarturl.entity.ClickAnalytics;
import com.smarturl.entity.Url;
import com.smarturl.repository.ClickAnalyticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua_parser.Client;
import ua_parser.Parser;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    private final ClickAnalyticsRepository analyticsRepository;
    private final Parser uaParser;

    public AnalyticsService(ClickAnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
        this.uaParser = new Parser();
    }

    @Async
    @Transactional
    public void recordClick(Url url, String ipAddress, String userAgentString, String referrer) {
        try {
            Client client = uaParser.parse(userAgentString);
            String browser = client.userAgent != null ? client.userAgent.family : "Unknown";
            String os = client.os != null ? client.os.family : "Unknown";
            String deviceType = classifyDevice(userAgentString);

            ClickAnalytics analytics = ClickAnalytics.builder()
                    .url(url).ipAddress(ipAddress).browser(browser).device(deviceType)
                    .operatingSystem(os).country("Unknown").city("Unknown")
                    .referrer(referrer != null && !referrer.isBlank() ? referrer : "Direct")
                    .userAgent(userAgentString != null && userAgentString.length() > 500 ? userAgentString.substring(0, 500) : userAgentString)
                    .build();
            analyticsRepository.save(analytics);
        } catch (Exception e) {
            logger.error("Failed to record click analytics", e);
        }
    }

    public AnalyticsSummary getAnalyticsForUrl(Long urlId) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        return AnalyticsSummary.builder()
                .totalClicks(analyticsRepository.countByUrlId(urlId))
                .uniqueVisitors(analyticsRepository.countUniqueVisitorsByUrlId(urlId))
                .clickTrend(analyticsRepository.getClickTrendByUrlId(urlId, since).stream()
                        .map(r -> new AnalyticsSummary.ClickTrendData(r[0].toString(), (Long) r[1])).collect(Collectors.toList()))
                .browserDistribution(mapDist(analyticsRepository.getBrowserDistributionByUrlId(urlId)))
                .deviceDistribution(mapDist(analyticsRepository.getDeviceDistributionByUrlId(urlId)))
                .osDistribution(mapDist(analyticsRepository.getOsDistributionByUrlId(urlId)))
                .countryDistribution(mapDist(analyticsRepository.getCountryDistributionByUrlId(urlId)))
                .referrerDistribution(mapDist(analyticsRepository.getReferrerDistributionByUrlId(urlId)))
                .build();
    }

    public AnalyticsSummary getAnalyticsForUser(Long userId) {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        return AnalyticsSummary.builder()
                .totalClicks(analyticsRepository.countTotalClicksByUserId(userId))
                .uniqueVisitors(analyticsRepository.countUniqueVisitorsByUserId(userId))
                .clickTrend(analyticsRepository.getClickTrendByUserId(userId, since).stream()
                        .map(r -> new AnalyticsSummary.ClickTrendData(r[0].toString(), (Long) r[1])).collect(Collectors.toList()))
                .browserDistribution(mapDist(analyticsRepository.getBrowserDistributionByUserId(userId)))
                .deviceDistribution(mapDist(analyticsRepository.getDeviceDistributionByUserId(userId)))
                .countryDistribution(mapDist(analyticsRepository.getCountryDistributionByUserId(userId)))
                .build();
    }

    private List<AnalyticsSummary.DistributionData> mapDist(List<Object[]> data) {
        return data.stream().map(r -> new AnalyticsSummary.DistributionData(
                r[0] != null ? r[0].toString() : "Unknown", (Long) r[1])).collect(Collectors.toList());
    }

    private String classifyDevice(String ua) {
        if (ua == null) return "Desktop";
        String lower = ua.toLowerCase();
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("iphone")) return "Mobile";
        if (lower.contains("tablet") || lower.contains("ipad")) return "Tablet";
        return "Desktop";
    }
}
