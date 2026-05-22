package com.mospi.backend.repository;

import com.mospi.backend.model.ClassificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassificationCodeRepository extends JpaRepository<ClassificationCode, Long> {

    List<ClassificationCode> findByClassificationId(Long classificationId);
}