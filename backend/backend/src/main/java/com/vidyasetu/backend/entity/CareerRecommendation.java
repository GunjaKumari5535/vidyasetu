
package com.vidyasetu.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "career_recommendations")
public class CareerRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private String currentClass;

    private String interests;

    private String recommendedStream;

    private String recommendedCourse;

    private String recommendedCareer;

    private String reason;

    public CareerRecommendation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getCurrentClass() {
        return currentClass;
    }

    public void setCurrentClass(String currentClass) {
        this.currentClass = currentClass;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getRecommendedStream() {
        return recommendedStream;
    }

    public void setRecommendedStream(String recommendedStream) {
        this.recommendedStream = recommendedStream;
    }

    public String getRecommendedCourse() {
        return recommendedCourse;
    }

    public void setRecommendedCourse(String recommendedCourse) {
        this.recommendedCourse = recommendedCourse;
    }

    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(String recommendedCareer) {
        this.recommendedCareer = recommendedCareer;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
