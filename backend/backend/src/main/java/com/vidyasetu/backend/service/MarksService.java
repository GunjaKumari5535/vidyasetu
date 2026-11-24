
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Marks;
import com.vidyasetu.backend.entity.Alert;
import com.vidyasetu.backend.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final AlertService alertService;

    public MarksService(MarksRepository marksRepository,
                        AlertService alertService) {
        this.marksRepository = marksRepository;
        this.alertService = alertService;
    }

    public Marks saveMarks(Marks marks) {

        Marks savedMarks = marksRepository.save(marks);

        double percentage =
                (marks.getMarksObtained() / marks.getMaxMarks()) * 100;

        // Check for low performance
        if (percentage < 40) {

            Alert alert = new Alert();

            alert.setStudentId(marks.getStudentId());
            alert.setPercentage(percentage);
            alert.setAlertType("LOW_PERFORMANCE");
            alert.setMessage(
                    "Student scored below 40%. Immediate attention required."
            );
            alert.setStatus("PENDING");
            alert.setCreatedAt(java.time.LocalDateTime.now());

            alertService.saveAlert(alert);
        }

        // Check falling performance
        List<Marks> previousMarks =
   marksRepository.findByStudentIdOrderByExamDateDescIdDesc(
        marks.getStudentId()
);

        if (previousMarks.size() >= 2) {

            Marks latest = previousMarks.get(0);
            Marks previous = previousMarks.get(1);

            double latestPercentage =
                    (latest.getMarksObtained() / latest.getMaxMarks()) * 100;

            double previousPercentage =
                    (previous.getMarksObtained() / previous.getMaxMarks()) * 100;

            double decrease = previousPercentage - latestPercentage;

            if (decrease > 15) {

                Alert alert = new Alert();

                alert.setStudentId(marks.getStudentId());
                alert.setPercentage(latestPercentage);
                alert.setAlertType("FALLING_PERFORMANCE");
                alert.setMessage(
                        "Student performance has decreased by more than 15 percentage points."
                );
                alert.setStatus("PENDING");
                alert.setCreatedAt(java.time.LocalDateTime.now());

                alertService.saveAlert(alert);
            }
        }

        return savedMarks;
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }


    public List<Marks> getMarksByStudentId(Long studentId) {
    return marksRepository.findByStudentIdOrderByExamDateDescIdDesc(studentId);
}
}
