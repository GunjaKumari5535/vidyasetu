package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    List<Scholarship> findByClassLevel(String classLevel);
}
