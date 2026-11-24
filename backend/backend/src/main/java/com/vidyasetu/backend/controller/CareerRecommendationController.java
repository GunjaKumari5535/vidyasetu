
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.dto.CareerQuizRequest;
import com.vidyasetu.backend.entity.CareerRecommendation;
import com.vidyasetu.backend.service.CareerRecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career")
@CrossOrigin(origins = "*")
public class CareerRecommendationController {

    private final CareerRecommendationService recommendationService;

    public CareerRecommendationController(
            CareerRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/quiz")
    public CareerRecommendation submitQuiz(
            @RequestBody CareerQuizRequest request) {
        return recommendationService.generateRecommendation(request);
    }

    @GetMapping("/recommend/{studentId}")
    public List<CareerRecommendation> getRecommendations(
            @PathVariable Long studentId) {
        return recommendationService.getRecommendations(studentId);
    }
}
