package com.smarturl.controller;

import com.smarturl.dto.*;
import com.smarturl.entity.User;
import com.smarturl.service.AnalyticsService;
import com.smarturl.service.AuthService;
import com.smarturl.service.SpamDetectionService;
import com.smarturl.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@Tag(name = "URL Management", description = "Create, read, update, and delete short URLs")
public class UrlController {

    private final UrlService urlService;
    private final AuthService authService;
    private final AnalyticsService analyticsService;
    private final SpamDetectionService spamDetectionService;

    public UrlController(UrlService urlService, AuthService authService,
                         AnalyticsService analyticsService, SpamDetectionService spamDetectionService) {
        this.urlService = urlService;
        this.authService = authService;
        this.analyticsService = analyticsService;
        this.spamDetectionService = spamDetectionService;
    }

    @PostMapping
    @Operation(summary = "Create a new short URL")
    public ResponseEntity<UrlResponse> createUrl(@Valid @RequestBody CreateUrlRequest request, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return new ResponseEntity<>(urlService.createUrl(request, user), HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple short URLs")
    public ResponseEntity<List<UrlResponse>> createBulkUrls(@Valid @RequestBody BulkUrlRequest request, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return new ResponseEntity<>(urlService.createBulkUrls(request, user), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all URLs for authenticated user")
    public ResponseEntity<Page<UrlResponse>> getMyUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.getUrlsByUser(user.getId(), search,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get URL details by ID")
    public ResponseEntity<UrlResponse> getUrl(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.getUrlById(id, user.getId()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a URL")
    public ResponseEntity<UrlResponse> updateUrl(@PathVariable Long id,
            @Valid @RequestBody UpdateUrlRequest request, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.updateUrl(id, request, user.getId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a URL")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        urlService.deleteUrl(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle URL active status")
    public ResponseEntity<UrlResponse> toggleUrl(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.toggleUrlActive(id, user.getId()));
    }

    @GetMapping("/{id}/analytics")
    @Operation(summary = "Get analytics for a specific URL")
    public ResponseEntity<AnalyticsSummary> getUrlAnalytics(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        urlService.getUrlById(id, user.getId()); // Verify ownership
        return ResponseEntity.ok(analyticsService.getAnalyticsForUrl(id));
    }

    @PostMapping("/check-safety")
    @Operation(summary = "Check URL safety before shortening")
    public ResponseEntity<UrlSafetyResult> checkUrlSafety(@RequestBody CreateUrlRequest request) {
        return ResponseEntity.ok(spamDetectionService.analyzeUrl(request.getOriginalUrl()));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStats> getDashboardStats(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.getDashboardStats(user.getId()));
    }

    @GetMapping("/dashboard/analytics")
    @Operation(summary = "Get user-wide analytics")
    public ResponseEntity<AnalyticsSummary> getUserAnalytics(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(analyticsService.getAnalyticsForUser(user.getId()));
    }

    @GetMapping("/top-performing")
    @Operation(summary = "Get top performing links")
    public ResponseEntity<List<UrlResponse>> getTopLinks(
            @RequestParam(defaultValue = "5") int limit, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(urlService.getTopPerformingLinks(user.getId(), limit));
    }
}
