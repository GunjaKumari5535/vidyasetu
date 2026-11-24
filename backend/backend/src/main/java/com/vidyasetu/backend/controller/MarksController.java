package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Marks;
import com.vidyasetu.backend.service.MarksService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping
    public Marks addMarks(@RequestBody Marks marks) {
        return marksService.saveMarks(marks);
    }

    @GetMapping
    public List<Marks> getAllMarks() {
        return marksService.getAllMarks();
    }
}