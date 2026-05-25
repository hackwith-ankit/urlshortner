package com.smarturl.repository;

import com.smarturl.entity.BlacklistedDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlacklistedDomainRepository extends JpaRepository<BlacklistedDomain, Long> {

    boolean existsByDomain(String domain);

    Optional<BlacklistedDomain> findByDomain(String domain);

    List<BlacklistedDomain> findAllByOrderByCreatedAtDesc();
}
