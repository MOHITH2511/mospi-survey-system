package com.mospi.backend.repository;

import com.mospi.backend.model.EnumeratorTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnumeratorTaskRepository extends JpaRepository<EnumeratorTask, Long> {
}