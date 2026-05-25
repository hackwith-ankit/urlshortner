package com.smarturl.service;

import com.smarturl.dto.*;
import com.smarturl.entity.Url;
import com.smarturl.entity.User;
import com.smarturl.exception.BadRequestException;
import com.smarturl.exception.ResourceNotFoundException;
import com.smarturl.repository.ClickAnalyticsRepository;
import com.smarturl.repository.UrlRepository;
import com.smarturl.util.ShortCodeGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private static final Logger logger = LoggerFactory.getLogger(UrlService.class);

    private final UrlRepository urlRepository;
    private final ClickAnalyticsRepository analyticsRepository;
    private final SpamDetectionService spamDetectionService;
    private final QrCodeService qrCodeService;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.short-code-length:7}")
    private int shortCodeLength;

    public UrlService(UrlRepository urlRepository, ClickAnalyticsRepository analyticsRepository,
                      SpamDetectionService spamDetectionService, QrCodeService qrCodeService) {
        this.urlRepository = urlRepository;
        this.analyticsRepository = analyticsRepository;
        this.spamDetectionService = spamDetectionService;
        this.qrCodeService = qrCodeService;
    }

    @Transactional
    public UrlResponse createUrl(CreateUrlRequest request, User user) {
        // Check spam
        UrlSafetyResult safetyResult = spamDetectionService.analyzeUrl(request.getOriginalUrl());

        // Generate or validate short code
        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            shortCode = request.getCustomAlias().trim();
            if (urlRepository.existsByShortCode(shortCode) || urlRepository.existsByCustomAlias(shortCode)) {
                throw new BadRequestException("Custom alias '" + shortCode + "' is already taken");
            }
            if (!shortCode.matches("^[a-zA-Z0-9_-]+$")) {
                throw new BadRequestException("Custom alias can only contain letters, numbers, hyphens, and underscores");
            }
        } else {
            shortCode = generateUniqueShortCode();
        }

        // Generate QR code
        String shortUrl = baseUrl + "/s/" + shortCode;
        String qrCodeData = qrCodeService.generateQrCodeBase64(shortUrl);

        // Build entity
        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .qrCodeData(qrCodeData)
                .isActive(true)
                .riskLevel(Url.RiskLevel.valueOf(safetyResult.getRiskLevel()))
                .user(user)
                .build();

        url = urlRepository.save(url);
        logger.info("Created short URL: {} -> {} [Risk: {}]", shortCode, request.getOriginalUrl(), safetyResult.getRiskLevel());

        return mapToResponse(url);
    }

    @Transactional
    public List<UrlResponse> createBulkUrls(BulkUrlRequest request, User user) {
        List<UrlResponse> responses = new ArrayList<>();
        for (CreateUrlRequest urlRequest : request.getUrls()) {
            try {
                responses.add(createUrl(urlRequest, user));
            } catch (Exception e) {
                logger.warn("Failed to create URL: {} - {}", urlRequest.getOriginalUrl(), e.getMessage());
            }
        }
        return responses;
    }

    public Page<UrlResponse> getUrlsByUser(Long userId, String search, Pageable pageable) {
        Page<Url> urls;
        if (search != null && !search.isBlank()) {
            urls = urlRepository.searchByUserIdAndQuery(userId, search, pageable);
        } else {
            urls = urlRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }
        return urls.map(this::mapToResponse);
    }

    public UrlResponse getUrlById(Long id, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL", "id", id));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to access this URL");
        }
        return mapToResponse(url);
    }

    public Url getUrlByShortCode(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("URL", "shortCode", shortCode));
    }

    @Transactional
    public UrlResponse updateUrl(Long id, UpdateUrlRequest request, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL", "id", id));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to modify this URL");
        }

        if (request.getOriginalUrl() != null) {
            url.setOriginalUrl(request.getOriginalUrl());
            UrlSafetyResult safetyResult = spamDetectionService.analyzeUrl(request.getOriginalUrl());
            url.setRiskLevel(Url.RiskLevel.valueOf(safetyResult.getRiskLevel()));
        }
        if (request.getCustomAlias() != null) {
            if (urlRepository.existsByCustomAlias(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias is already taken");
            }
            url.setCustomAlias(request.getCustomAlias());
        }
        if (request.getIsActive() != null) {
            url.setIsActive(request.getIsActive());
        }

        url = urlRepository.save(url);
        return mapToResponse(url);
    }

    @Transactional
    public void deleteUrl(Long id, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL", "id", id));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this URL");
        }
        urlRepository.delete(url);
    }

    @Transactional
    public UrlResponse toggleUrlActive(Long id, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL", "id", id));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to modify this URL");
        }
        url.setIsActive(!url.getIsActive());
        url = urlRepository.save(url);
        return mapToResponse(url);
    }

    @Transactional
    public void incrementClicks(Url url) {
        url.setTotalClicks(url.getTotalClicks() + 1);
        urlRepository.save(url);
    }

    public DashboardStats getDashboardStats(Long userId) {
        long totalLinks = urlRepository.countByUserId(userId);
        long activeLinks = urlRepository.countByUserIdAndIsActiveTrue(userId);
        long totalClicks = analyticsRepository.countTotalClicksByUserId(userId);
        long uniqueVisitors = analyticsRepository.countUniqueVisitorsByUserId(userId);
        long qrGenerated = totalLinks; // Every link gets a QR
        long spamBlocked = urlRepository.countSpamLinksBlocked();

        return DashboardStats.builder()
                .totalLinks(totalLinks)
                .activeLinks(activeLinks)
                .totalClicks(totalClicks)
                .uniqueVisitors(uniqueVisitors)
                .qrCodesGenerated(qrGenerated)
                .spamLinksBlocked(spamBlocked)
                .build();
    }

    public List<UrlResponse> getTopPerformingLinks(Long userId, int limit) {
        return urlRepository.findTopPerformingByUserId(userId, Pageable.ofSize(limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateUniqueShortCode() {
        String shortCode;
        int attempts = 0;
        do {
            shortCode = ShortCodeGenerator.generate(shortCodeLength);
            attempts++;
            if (attempts > 10) {
                throw new BadRequestException("Failed to generate unique short code. Please try again.");
            }
        } while (urlRepository.existsByShortCode(shortCode));
        return shortCode;
    }

    public UrlResponse mapToResponse(Url url) {
        long uniqueVisitors = 0;
        try {
            uniqueVisitors = analyticsRepository.countUniqueVisitorsByUrlId(url.getId());
        } catch (Exception ignored) {}

        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/s/" + url.getShortCode())
                .customAlias(url.getCustomAlias())
                .qrCodeData(url.getQrCodeData())
                .isActive(url.getIsActive())
                .riskLevel(url.getRiskLevel().name())
                .totalClicks(url.getTotalClicks())
                .uniqueVisitors(uniqueVisitors)
                .createdAt(url.getCreatedAt() != null ? url.getCreatedAt().toString() : null)
                .build();
    }
}
