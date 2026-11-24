
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Career;
import com.vidyasetu.backend.service.CareerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@CrossOrigin(origins = "*")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @PostMapping
    public Career saveCareer(@RequestBody Career career) {
        return careerService.saveCareer(career);
    }

    @GetMapping
    public List<Career> getAllCareers() {
        return careerService.getAllCareers();
    }
}
