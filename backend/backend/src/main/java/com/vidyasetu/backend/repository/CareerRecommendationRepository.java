
package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.CareerRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerRecommendationRepository
        extends JpaRepository<CareerRecommendation, Long> {

    List<CareerRecommendation> findByStudentId(Long studentId);
}
