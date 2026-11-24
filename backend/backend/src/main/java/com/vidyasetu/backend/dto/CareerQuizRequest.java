
package com.vidyasetu.backend.dto;

public class CareerQuizRequest {

    private Long studentId;

    private String currentClass;

    private String interests;

    private String preferredSubjects;

    public CareerQuizRequest() {
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

    public String getPreferredSubjects() {
        return preferredSubjects;
    }

    public void setPreferredSubjects(String preferredSubjects) {
        this.preferredSubjects = preferredSubjects;
    }
}
