package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.PincodeServiceabilityResponse;

public interface PincodeServiceabilityService {
    PincodeServiceabilityResponse checkServiceability(String pincode);
}
