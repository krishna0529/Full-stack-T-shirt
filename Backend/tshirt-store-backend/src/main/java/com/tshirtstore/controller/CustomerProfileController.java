package com.tshirtstore.controller;

import com.tshirtstore.dto.profile.CustomerProfileResponse;
import com.tshirtstore.dto.profile.UpdateProfileRequest;
import com.tshirtstore.service.CustomerProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/profile", "/api/v1/customer/profile"})
public class CustomerProfileController {

    private final CustomerProfileService profileService;

    public CustomerProfileController(CustomerProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<CustomerProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<CustomerProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
}
