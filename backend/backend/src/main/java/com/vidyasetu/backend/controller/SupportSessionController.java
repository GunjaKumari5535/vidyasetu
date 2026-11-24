
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.SupportSession;
import com.vidyasetu.backend.service.SupportSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo/sessions")
public class SupportSessionController {

    private final SupportSessionService supportSessionService;

    public SupportSessionController(
            SupportSessionService supportSessionService) {
        this.supportSessionService = supportSessionService;
    }

    @PostMapping
    public SupportSession createSession(
            @RequestBody SupportSession session) {
        return supportSessionService.saveSession(session);
    }

    @GetMapping
    public List<SupportSession> getAllSessions() {
        return supportSessionService.getAllSessions();
    }
}
