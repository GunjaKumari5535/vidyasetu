
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.SupportSession;
import com.vidyasetu.backend.repository.SupportSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportSessionService {

    private final SupportSessionRepository supportSessionRepository;

    public SupportSessionService(
            SupportSessionRepository supportSessionRepository) {
        this.supportSessionRepository = supportSessionRepository;
    }

    public SupportSession saveSession(SupportSession session) {
        return supportSessionRepository.save(session);
    }

    public List<SupportSession> getAllSessions() {
        return supportSessionRepository.findAll();
    }
}
