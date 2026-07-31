package com.example.sms.repository;

import com.example.sms.model.AadharRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AadharRepository extends JpaRepository<AadharRecord, Long> {
}
