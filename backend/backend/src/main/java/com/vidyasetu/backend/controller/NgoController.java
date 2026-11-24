package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Ngo;
import com.vidyasetu.backend.service.NgoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo")
public class NgoController {

    private final NgoService ngoService;

    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @PostMapping
    public Ngo createNgo(@RequestBody Ngo ngo) {
        return ngoService.saveNgo(ngo);
    }

    @GetMapping
    public List<Ngo> getAllNgos() {
        return ngoService.getAllNgos();
    }

    @GetMapping("/low-performers")
public List<com.vidyasetu.backend.entity.Student> getLowPerformers(
        @RequestParam(required = false) String village,
        @RequestParam(required = false) Long subject) {

    return ngoService.getLowPerformers(village, subject);
}
}