package com.smarturl.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_analytics", indexes = {
        @Index(name = "idx_url_id", columnList = "url_id"),
        @Index(name = "idx_clicked_at", columnList = "clicked_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id", nullable = false)
    private Url url;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(length = 100)
    private String browser;

    @Column(length = 50)
    private String device;

    @Column(name = "os", length = 100)
    private String operatingSystem;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(length = 500)
    private String referrer;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @CreationTimestamp
    @Column(name = "clicked_at", updatable = false)
    private LocalDateTime clickedAt;
}
