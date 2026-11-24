
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Subject;
import com.vidyasetu.backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject addSubject(Subject subject) {

        if (subject.getName() == null || subject.getName().trim().isEmpty()) {
            throw new RuntimeException("Subject name is required.");
        }

        String subjectName = subject.getName().trim();

        if (subjectRepository.existsByNameIgnoreCase(subjectName)) {
            throw new RuntimeException("This subject already exists.");
        }

        subject.setName(subjectName);

        return subjectRepository.save(subject);
    }
}
