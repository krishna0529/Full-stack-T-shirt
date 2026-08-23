package com.tshirtstore.service;

import com.tshirtstore.dto.profile.CustomerProfileResponse;
import com.tshirtstore.dto.profile.UpdateProfileRequest;

public interface CustomerProfileService {
    CustomerProfileResponse getProfile();
    CustomerProfileResponse updateProfile(UpdateProfileRequest request);
}
