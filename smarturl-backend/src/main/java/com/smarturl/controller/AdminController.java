package com.smarturl.controller;

import com.smarturl.dto.DashboardStats;
import com.smarturl.dto.UrlResponse;
import com.smarturl.entity.BlacklistedDomain;
import com.smarturl.entity.Url;
import com.smarturl.entity.User;
import com.smarturl.exception.ResourceNotFoundException;
import com.smarturl.repository.BlacklistedDomainRepository;
import com.smarturl.repository.ClickAnalyticsRepository;
import com.smarturl.repository.UrlRepository;
import com.smarturl.repository.UserRepository;
import com.smarturl.dto.AuthResponse;
import com.smarturl.service.UrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {

    private final UserRepository userRepository;
    private final UrlRepository urlRepository;
    private final ClickAnalyticsRepository analyticsRepository;
    private final BlacklistedDomainRepository blacklistRepository;
    private final UrlService urlService;

    public AdminController(UserRepository userRepository, UrlRepository urlRepository,
                           ClickAnalyticsRepository analyticsRepository,
                           BlacklistedDomainRepository blacklistRepository, UrlService urlService) {
        this.userRepository = userRepository;
        this.urlRepository = urlRepository;
        this.analyticsRepository = analyticsRepository;
        this.blacklistRepository = blacklistRepository;
        this.urlService = urlService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all users (paginated)")
    public ResponseEntity<Page<AuthResponse.UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<User> users = userRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return ResponseEntity.ok(users.map(u -> AuthResponse.UserDto.builder()
                .id(u.getId()).name(u.getName()).email(u.getEmail())
                .role(u.getRole().name()).createdAt(u.getCreatedAt().toString()).build()));
    }

    @GetMapping("/urls")
    @Operation(summary = "List all URLs (paginated)")
    public ResponseEntity<Page<UrlResponse>> getUrls(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Url> urls = urlRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return ResponseEntity.ok(urls.map(urlService::mapToResponse));
    }

    @PutMapping("/urls/{id}/block")
    @Operation(summary = "Block a malicious URL")
    public ResponseEntity<Map<String, String>> blockUrl(@PathVariable Long id) {
        Url url = urlRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("URL", "id", id));
        url.setIsActive(false);
        url.setRiskLevel(Url.RiskLevel.HIGH_RISK);
        urlRepository.save(url);
        return ResponseEntity.ok(Map.of("message", "URL blocked successfully"));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Disable a user")
    public ResponseEntity<Map<String, String>> disableUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User disabled successfully"));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get system-wide statistics")
    public ResponseEntity<DashboardStats> getSystemStats() {
        return ResponseEntity.ok(DashboardStats.builder()
                .totalLinks(urlRepository.count())
                .activeLinks(urlRepository.countByIsActiveTrue())
                .totalClicks(analyticsRepository.count())
                .uniqueVisitors(analyticsRepository.countAllUniqueVisitors())
                .qrCodesGenerated(urlRepository.count())
                .spamLinksBlocked(urlRepository.countSpamLinksBlocked())
                .build());
    }

    @GetMapping("/blacklist")
    @Operation(summary = "List blacklisted domains")
    public ResponseEntity<?> getBlacklist() {
        return ResponseEntity.ok(blacklistRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/blacklist")
    @Operation(summary = "Add domain to blacklist")
    public ResponseEntity<?> addToBlacklist(@RequestBody Map<String, String> request) {
        BlacklistedDomain domain = BlacklistedDomain.builder()
                .domain(request.get("domain"))
                .reason(request.get("reason"))
                .build();
        return new ResponseEntity<>(blacklistRepository.save(domain), HttpStatus.CREATED);
    }

    @DeleteMapping("/blacklist/{id}")
    @Operation(summary = "Remove domain from blacklist")
    public ResponseEntity<Map<String, String>> deleteFromBlacklist(@PathVariable Long id) {
        BlacklistedDomain domain = blacklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlacklistedDomain", "id", id));
        blacklistRepository.delete(domain);
        return ResponseEntity.ok(Map.of("message", "Domain removed from blacklist successfully"));
    }
}
