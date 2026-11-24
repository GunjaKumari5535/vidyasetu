package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Scholarship;
import com.vidyasetu.backend.repository.ScholarshipRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    public Scholarship saveScholarship(Scholarship scholarship) {
        return scholarshipRepository.save(scholarship);
    }

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    public List<Scholarship> getScholarshipsByClass(String classLevel) {
        return scholarshipRepository.findByClassLevel(classLevel);
    }
}