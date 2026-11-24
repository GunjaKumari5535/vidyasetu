
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.dto.CareerQuizRequest;
import com.vidyasetu.backend.entity.CareerRecommendation;
import com.vidyasetu.backend.entity.Marks;
import com.vidyasetu.backend.repository.CareerRecommendationRepository;
import com.vidyasetu.backend.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerRecommendationService {

    private final CareerRecommendationRepository recommendationRepository;
    private final MarksRepository marksRepository;

    public CareerRecommendationService(
            CareerRecommendationRepository recommendationRepository,
            MarksRepository marksRepository) {
        this.recommendationRepository = recommendationRepository;
        this.marksRepository = marksRepository;
    }

    public CareerRecommendation generateRecommendation(
            CareerQuizRequest request) {

        List<Marks> marksList =
                marksRepository.findByStudentIdOrderByExamDateDescIdDesc(
                        request.getStudentId());

        double averagePercentage = marksList.stream()
                .mapToDouble(mark ->
                        mark.getMaxMarks() > 0
                                ? mark.getMarksObtained() * 100.0
                                / mark.getMaxMarks()
                                : 0)
                .average()
                .orElse(0);

        String interests = request.getInterests().toLowerCase();

        String stream;
        String course;
        String career;
        String reason;

        if (interests.contains("computer")
                || interests.contains("technology")
                || interests.contains("coding")) {

            stream = "Science";
            course = "B.Tech Computer Science / BCA";
            career = "Software Developer";
            reason = "Recommended based on your interest in technology and coding.";

        } else if (interests.contains("medical")
                || interests.contains("biology")
                || interests.contains("health")) {

            stream = "Science";
            course = "MBBS / B.Sc Nursing / Pharmacy";
            career = "Healthcare Professional";
            reason = "Recommended based on your interest in biology and healthcare.";

        } else if (interests.contains("business")
                || interests.contains("commerce")
                || interests.contains("finance")) {

            stream = "Commerce";
            course = "B.Com / BBA";
            career = "Accountant / Business Analyst";
            reason = "Recommended based on your interest in business and finance.";

        } else if (interests.contains("art")
                || interests.contains("history")
                || interests.contains("social")) {

            stream = "Arts";
            course = "BA / Social Sciences";
            career = "Teacher / Civil Services Aspirant";
            reason = "Recommended based on your interest in arts and social studies.";

        } else {

            stream = "Science / Commerce / Arts";
            course = "Explore courses based on your interests";
            career = "Explore different career options";
            reason = "Explore your interests and academic strengths before choosing.";
        }

        if (averagePercentage > 0) {
            reason += " Your recorded average marks percentage is "
                    + String.format("%.2f", averagePercentage) + "%.";
        } else {
            reason += " No marks records were found, so this recommendation is based on interests only.";
        }

        CareerRecommendation recommendation =
                new CareerRecommendation();

        recommendation.setStudentId(request.getStudentId());
        recommendation.setCurrentClass(request.getCurrentClass());
        recommendation.setInterests(request.getInterests());
        recommendation.setRecommendedStream(stream);
        recommendation.setRecommendedCourse(course);
        recommendation.setRecommendedCareer(career);
        recommendation.setReason(reason);

        return recommendationRepository.save(recommendation);
    }

    public List<CareerRecommendation> getRecommendations(Long studentId) {
        return recommendationRepository.findByStudentId(studentId);
    }
}
