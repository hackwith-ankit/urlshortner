package com.smarturl.service;

import com.smarturl.dto.UrlSafetyResult;
import com.smarturl.repository.BlacklistedDomainRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class SpamDetectionService {

    private final BlacklistedDomainRepository blacklistRepository;

    private static final Set<String> SUSPICIOUS_KEYWORDS = Set.of(
            "login", "verify", "account", "update", "secure", "banking", "confirm",
            "password", "credential", "wallet", "suspend", "unusual", "expire",
            "click-here", "free-money", "winner", "prize", "urgent", "act-now"
    );

    private static final Pattern IP_URL_PATTERN = Pattern.compile(
            "https?://\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*");

    private static final Pattern EXCESSIVE_SPECIAL_CHARS = Pattern.compile(
            ".*[%@#!$&]{3,}.*");

    private static final Set<String> SUSPICIOUS_TLDS = Set.of(
            ".tk", ".ml", ".ga", ".cf", ".gq", ".buzz", ".xyz", ".top", ".work", ".click"
    );

    public SpamDetectionService(BlacklistedDomainRepository blacklistRepository) {
        this.blacklistRepository = blacklistRepository;
    }

    public UrlSafetyResult analyzeUrl(String url) {
        List<UrlSafetyResult.SecurityCheck> checks = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int riskScore = 0;

        // 1. HTTPS Check
        boolean isHttps = url.startsWith("https://");
        checks.add(new UrlSafetyResult.SecurityCheck("HTTPS Protocol", isHttps,
                isHttps ? "URL uses secure HTTPS" : "URL does not use HTTPS"));
        if (!isHttps) { riskScore += 15; warnings.add("URL does not use HTTPS protocol"); }

        // 2. Suspicious keywords
        String lowerUrl = url.toLowerCase();
        boolean hasKeywords = SUSPICIOUS_KEYWORDS.stream().anyMatch(lowerUrl::contains);
        checks.add(new UrlSafetyResult.SecurityCheck("Suspicious Keywords", !hasKeywords,
                hasKeywords ? "Contains suspicious keywords" : "No suspicious keywords found"));
        if (hasKeywords) { riskScore += 20; warnings.add("URL contains suspicious keywords"); }

        // 3. IP-based URL
        boolean isIpUrl = IP_URL_PATTERN.matcher(url).matches();
        checks.add(new UrlSafetyResult.SecurityCheck("IP-based URL", !isIpUrl,
                isIpUrl ? "Uses IP address instead of domain" : "Uses domain name"));
        if (isIpUrl) { riskScore += 30; warnings.add("URL uses IP address instead of domain name"); }

        // 4. Excessive special characters
        boolean hasExcessiveChars = EXCESSIVE_SPECIAL_CHARS.matcher(url).matches();
        checks.add(new UrlSafetyResult.SecurityCheck("Special Characters", !hasExcessiveChars,
                hasExcessiveChars ? "Contains excessive special characters" : "Normal character usage"));
        if (hasExcessiveChars) { riskScore += 15; warnings.add("URL contains excessive special characters"); }

        // 5. URL obfuscation (encoded chars)
        boolean hasObfuscation = url.contains("%2F") || url.contains("%3A") || url.contains("%40")
                || url.contains("@") && url.indexOf("@") < url.indexOf("/", 8);
        checks.add(new UrlSafetyResult.SecurityCheck("URL Obfuscation", !hasObfuscation,
                hasObfuscation ? "Possible URL obfuscation detected" : "No obfuscation detected"));
        if (hasObfuscation) { riskScore += 25; warnings.add("Possible URL obfuscation detected"); }

        // 6. Blacklisted domain
        String domain = extractDomain(url);
        boolean isBlacklisted = domain != null && blacklistRepository.existsByDomain(domain);
        checks.add(new UrlSafetyResult.SecurityCheck("Domain Blacklist", !isBlacklisted,
                isBlacklisted ? "Domain is blacklisted" : "Domain is not blacklisted"));
        if (isBlacklisted) { riskScore += 50; warnings.add("Domain is on the blacklist"); }

        // 7. Suspicious TLD
        boolean hasSuspiciousTld = domain != null && SUSPICIOUS_TLDS.stream().anyMatch(domain::endsWith);
        checks.add(new UrlSafetyResult.SecurityCheck("Domain Reputation", !hasSuspiciousTld,
                hasSuspiciousTld ? "Uses a suspicious TLD" : "Domain TLD appears legitimate"));
        if (hasSuspiciousTld) { riskScore += 15; warnings.add("URL uses a suspicious top-level domain"); }

        // Classify risk
        String riskLevel;
        if (riskScore >= 50) riskLevel = "HIGH_RISK";
        else if (riskScore >= 20) riskLevel = "SUSPICIOUS";
        else riskLevel = "SAFE";

        return UrlSafetyResult.builder()
                .riskLevel(riskLevel)
                .safe(riskScore < 20)
                .warnings(warnings)
                .checks(checks)
                .build();
    }

    private String extractDomain(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            return host != null ? host.toLowerCase() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
