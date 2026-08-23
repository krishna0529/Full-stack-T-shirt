package com.tshirtstore.controller.admin;

import com.tshirtstore.service.admin.AdminSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingController {

    private final AdminSettingService adminSettingService;

    public AdminSettingController(AdminSettingService adminSettingService) {
        this.adminSettingService = adminSettingService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettings() {
        return ResponseEntity.ok(adminSettingService.getAllSettings());
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> updateSettings(@RequestBody Map<String, String> settings) {
        return ResponseEntity.ok(adminSettingService.updateSettings(settings));
    }
}
