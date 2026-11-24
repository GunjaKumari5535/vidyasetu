package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStudentId(Long studentId);

}