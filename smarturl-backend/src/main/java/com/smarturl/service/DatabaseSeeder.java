package com.smarturl.service;

import com.smarturl.entity.BlacklistedDomain;
import com.smarturl.entity.User;
import com.smarturl.repository.BlacklistedDomainRepository;
import com.smarturl.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final BlacklistedDomainRepository blacklistRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(BlacklistedDomainRepository blacklistRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.blacklistRepository = blacklistRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin and user
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@smarturl.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .isActive(true)
                    .build();

            User user = User.builder()
                    .name("Demo User")
                    .email("user@smarturl.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(User.Role.USER)
                    .isActive(true)
                    .build();

            userRepository.saveAll(List.of(admin, user));
            System.out.println("Seeded default users: admin@smarturl.com (admin123) and user@smarturl.com (user123)");
        }

        // Seed blacklist domains
        if (blacklistRepository.count() == 0) {
            List<BlacklistedDomain> domains = List.of(
                    BlacklistedDomain.builder().domain("malware-site.com").reason("Known malware distribution").build(),
                    BlacklistedDomain.builder().domain("phishing-example.com").reason("Phishing site").build(),
                    BlacklistedDomain.builder().domain("suspicious-login.tk").reason("Credential stealing").build(),
                    BlacklistedDomain.builder().domain("fake-bank.ml").reason("Banking fraud").build(),
                    BlacklistedDomain.builder().domain("free-prizes.ga").reason("Scam site").build(),
                    BlacklistedDomain.builder().domain("click-bait.cf").reason("Malicious redirects").build(),
                    BlacklistedDomain.builder().domain("virus-download.gq").reason("Malware distribution").build(),
                    BlacklistedDomain.builder().domain("steal-data.buzz").reason("Data theft").build(),
                    BlacklistedDomain.builder().domain("fake-update.xyz").reason("Fake software updates").build(),
                    BlacklistedDomain.builder().domain("crypto-scam.top").reason("Cryptocurrency scam").build()
            );
            blacklistRepository.saveAll(domains);
            System.out.println("Seeded default blacklisted domains");
        }
    }
}
