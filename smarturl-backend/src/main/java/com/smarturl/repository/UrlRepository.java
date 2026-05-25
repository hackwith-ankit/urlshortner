package com.smarturl.repository;

import com.smarturl.entity.Url;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    Optional<Url> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    Page<Url> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Url> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndIsActiveTrue(Long userId);

    long countByIsActiveTrue();

    @Query("SELECT u FROM Url u WHERE u.user.id = :userId ORDER BY u.totalClicks DESC")
    List<Url> findTopPerformingByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT u FROM Url u ORDER BY u.totalClicks DESC")
    List<Url> findTopPerforming(Pageable pageable);

    @Query("SELECT COUNT(u) FROM Url u WHERE u.riskLevel = 'HIGH_RISK' OR u.riskLevel = 'SUSPICIOUS'")
    long countSpamLinksBlocked();

    Page<Url> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT u FROM Url u WHERE u.user.id = :userId AND (LOWER(u.originalUrl) LIKE LOWER(CONCAT('%',:query,'%')) OR LOWER(u.shortCode) LIKE LOWER(CONCAT('%',:query,'%')))")
    Page<Url> searchByUserIdAndQuery(@Param("userId") Long userId, @Param("query") String query, Pageable pageable);
}
