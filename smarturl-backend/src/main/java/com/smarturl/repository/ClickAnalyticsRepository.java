package com.smarturl.repository;

import com.smarturl.entity.ClickAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {

    List<ClickAnalytics> findByUrlIdOrderByClickedAtDesc(Long urlId);

    long countByUrlId(Long urlId);

    @Query("SELECT COUNT(DISTINCT c.ipAddress) FROM ClickAnalytics c WHERE c.url.id = :urlId")
    long countUniqueVisitorsByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COUNT(DISTINCT c.ipAddress) FROM ClickAnalytics c WHERE c.url.user.id = :userId")
    long countUniqueVisitorsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(c) FROM ClickAnalytics c WHERE c.url.user.id = :userId")
    long countTotalClicksByUserId(@Param("userId") Long userId);

    // Click trend data - clicks per day
    @Query("SELECT FUNCTION('DATE', c.clickedAt) as date, COUNT(c) as clicks FROM ClickAnalytics c WHERE c.url.id = :urlId AND c.clickedAt >= :since GROUP BY FUNCTION('DATE', c.clickedAt) ORDER BY date")
    List<Object[]> getClickTrendByUrlId(@Param("urlId") Long urlId, @Param("since") LocalDateTime since);

    @Query("SELECT FUNCTION('DATE', c.clickedAt) as date, COUNT(c) as clicks FROM ClickAnalytics c WHERE c.url.user.id = :userId AND c.clickedAt >= :since GROUP BY FUNCTION('DATE', c.clickedAt) ORDER BY date")
    List<Object[]> getClickTrendByUserId(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    // Browser distribution
    @Query("SELECT c.browser, COUNT(c) FROM ClickAnalytics c WHERE c.url.id = :urlId GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> getBrowserDistributionByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT c.browser, COUNT(c) FROM ClickAnalytics c WHERE c.url.user.id = :userId GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> getBrowserDistributionByUserId(@Param("userId") Long userId);

    // Device distribution
    @Query("SELECT c.device, COUNT(c) FROM ClickAnalytics c WHERE c.url.id = :urlId GROUP BY c.device ORDER BY COUNT(c) DESC")
    List<Object[]> getDeviceDistributionByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT c.device, COUNT(c) FROM ClickAnalytics c WHERE c.url.user.id = :userId GROUP BY c.device ORDER BY COUNT(c) DESC")
    List<Object[]> getDeviceDistributionByUserId(@Param("userId") Long userId);

    // OS distribution
    @Query("SELECT c.operatingSystem, COUNT(c) FROM ClickAnalytics c WHERE c.url.id = :urlId GROUP BY c.operatingSystem ORDER BY COUNT(c) DESC")
    List<Object[]> getOsDistributionByUrlId(@Param("urlId") Long urlId);

    // Country distribution
    @Query("SELECT c.country, COUNT(c) FROM ClickAnalytics c WHERE c.url.id = :urlId GROUP BY c.country ORDER BY COUNT(c) DESC")
    List<Object[]> getCountryDistributionByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT c.country, COUNT(c) FROM ClickAnalytics c WHERE c.url.user.id = :userId GROUP BY c.country ORDER BY COUNT(c) DESC")
    List<Object[]> getCountryDistributionByUserId(@Param("userId") Long userId);

    // Referrer distribution
    @Query("SELECT c.referrer, COUNT(c) FROM ClickAnalytics c WHERE c.url.id = :urlId GROUP BY c.referrer ORDER BY COUNT(c) DESC")
    List<Object[]> getReferrerDistributionByUrlId(@Param("urlId") Long urlId);

    // Global stats
    @Query("SELECT COUNT(DISTINCT c.ipAddress) FROM ClickAnalytics c")
    long countAllUniqueVisitors();
}
