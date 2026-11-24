
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Career;
import com.vidyasetu.backend.repository.CareerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerService {

    private final CareerRepository careerRepository;

    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    public Career saveCareer(Career career) {
        return careerRepository.save(career);
    }

    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }
}
