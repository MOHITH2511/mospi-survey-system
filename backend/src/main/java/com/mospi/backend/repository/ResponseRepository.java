package com.mospi.backend.repository;

import com.mospi.backend.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ResponseRepository extends JpaRepository<Response, UUID> {
}