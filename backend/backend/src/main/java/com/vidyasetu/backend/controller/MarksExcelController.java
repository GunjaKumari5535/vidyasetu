package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Marks;
import com.vidyasetu.backend.service.MarksService;

import org.apache.poi.ss.usermodel.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksExcelController {

    private final MarksService marksService;

    public MarksExcelController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadExcel(
            @RequestParam("file") MultipartFile file) {

        List<Marks> uploadedMarks = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Marks marks = new Marks();

                marks.setStudentId((long) row.getCell(0).getNumericCellValue());
                marks.setSubjectId((long) row.getCell(1).getNumericCellValue());
                marks.setExamName(row.getCell(2).getStringCellValue());
                marks.setMarksObtained(row.getCell(3).getNumericCellValue());
                marks.setMaxMarks(row.getCell(4).getNumericCellValue());
                marks.setExamDate(
                    row.getCell(5).getLocalDateTimeCellValue().toLocalDate()
                );

                Marks savedMarks = marksService.saveMarks(marks);
                uploadedMarks.add(savedMarks);
            }

            return ResponseEntity.ok(uploadedMarks);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Excel upload failed: " + e.getMessage());
        }
    }
}