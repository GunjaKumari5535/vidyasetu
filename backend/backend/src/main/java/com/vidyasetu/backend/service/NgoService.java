package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Ngo;
import com.vidyasetu.backend.entity.Student;
import com.vidyasetu.backend.entity.Marks;
import com.vidyasetu.backend.repository.NgoRepository;
import com.vidyasetu.backend.repository.StudentRepository;
import com.vidyasetu.backend.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class NgoService {

    private final NgoRepository ngoRepository;
    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;

    public NgoService(
            NgoRepository ngoRepository,
            StudentRepository studentRepository,
            MarksRepository marksRepository) {
        this.ngoRepository = ngoRepository;
        this.studentRepository = studentRepository;
        this.marksRepository = marksRepository;
    }

    public Ngo saveNgo(Ngo ngo) {
        return ngoRepository.save(ngo);
    }

    public List<Ngo> getAllNgos() {
        return ngoRepository.findAll();
    }

    public List<Student> getLowPerformers(String village, Long subjectId) {

        List<Student> students;

        if (village != null && !village.isEmpty()) {
            students = studentRepository.findByVillage(village);
        } else {
            students = studentRepository.findAll();
        }

        List<Student> lowPerformers = new ArrayList<>();

        for (Student student : students) {

            List<Marks> marksList =
                    marksRepository.findByStudentId(student.getId());

            for (Marks marks : marksList) {

                if (subjectId != null &&
                        !subjectId.equals(marks.getSubjectId())) {
                    continue;
                }

                double percentage =
                        (marks.getMarksObtained() / marks.getMaxMarks()) * 100;

                if (percentage < 40) {
                    lowPerformers.add(student);
                    break;
                }
            }
        }

        return lowPerformers;
    }
}