package com.vidyasetu.backend.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(String toNumber, String messageBody) {

        System.out.println("\n========== VIDYASETU SMS NOTIFICATION ==========");
        System.out.println("To: " + toNumber);
        System.out.println("Message: " + messageBody);
        System.out.println("Status: SMS SIMULATED SUCCESSFULLY");
        System.out.println("================================================\n");
    }
}