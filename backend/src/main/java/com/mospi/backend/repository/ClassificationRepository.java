package com.mospi.backend.repository;

import com.mospi.backend.model.Classification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassificationRepository extends JpaRepository<Classification, Long> {
    Optional<Classification> findByName(String name);
}