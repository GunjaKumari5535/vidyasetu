package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Scholarship;
import com.vidyasetu.backend.service.ScholarshipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
@CrossOrigin(origins = "*")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @PostMapping
    public Scholarship addScholarship(@RequestBody Scholarship scholarship) {
        return scholarshipService.saveScholarship(scholarship);
    }

    @GetMapping
    public List<Scholarship> getScholarships(
            @RequestParam(required = false, name = "class") String classLevel) {

        if (classLevel != null) {
            return scholarshipService.getScholarshipsByClass(classLevel);
        }

        return scholarshipService.getAllScholarships();
    }
}