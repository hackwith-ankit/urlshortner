package com.smarturl.controller;

import com.smarturl.entity.Url;
import com.smarturl.service.AnalyticsService;
import com.smarturl.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@Tag(name = "Redirect", description = "Public URL redirection")
public class RedirectController {

    private final UrlService urlService;
    private final AnalyticsService analyticsService;

    public RedirectController(UrlService urlService, AnalyticsService analyticsService) {
        this.urlService = urlService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/s/{shortCode}")
    @Operation(summary = "Redirect short URL to original URL")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        Url url = urlService.getUrlByShortCode(shortCode);

        if (!url.getIsActive()) {
            return ResponseEntity.status(HttpStatus.GONE).build();
        }

        // Record analytics asynchronously
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");
        analyticsService.recordClick(url, ipAddress, userAgent, referrer);

        // Increment click count
        urlService.incrementClicks(url);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(url.getOriginalUrl()));
        return new ResponseEntity<>(headers, HttpStatus.MOVED_PERMANENTLY);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
