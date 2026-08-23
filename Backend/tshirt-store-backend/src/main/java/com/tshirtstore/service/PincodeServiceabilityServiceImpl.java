package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.PincodeServiceabilityResponse;
import com.tshirtstore.entity.PincodeServiceability;
import com.tshirtstore.exception.BadRequestException;
import com.tshirtstore.repository.PincodeServiceabilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class PincodeServiceabilityServiceImpl implements PincodeServiceabilityService {

    private static final Pattern PINCODE_PATTERN = Pattern.compile("^[1-9][0-9]{5}$");

    private final PincodeServiceabilityRepository repository;

    public PincodeServiceabilityServiceImpl(PincodeServiceabilityRepository repository) {
        this.repository = repository;
    }

    private void validatePincode(String pincode) {
        if (pincode == null || !PINCODE_PATTERN.matcher(pincode).matches()) {
            throw new BadRequestException("Invalid Indian pincode. Must be 6 digits.");
        }
    }

    @Override
    public PincodeServiceabilityResponse checkServiceability(String pincode) {
        validatePincode(pincode);

        Optional<PincodeServiceability> optionalData = repository.findByPincode(pincode);

        if (optionalData.isPresent()) {
            PincodeServiceability data = optionalData.get();
            boolean isServiceable = data.isActive() && (data.isStandardAvailable() || data.isExpressAvailable());
            String zoneName = data.getZone() != null ? data.getZone().getName() : "WEST";

            return new PincodeServiceabilityResponse(
                    data.getPincode(),
                    data.getCity(),
                    data.getState(),
                    zoneName,
                    isServiceable,
                    data.isStandardAvailable(),
                    data.isExpressAvailable(),
                    data.isCodAvailable(),
                    data.getEstimatedMinDays() != null ? data.getEstimatedMinDays() : 5,
                    data.getEstimatedMaxDays() != null ? data.getEstimatedMaxDays() : 2,
                    isServiceable ? "Pincode is serviceable" : "Delivery unavailable at this pincode"
            );
        }

        // Fallback for valid 6-digit Indian pincode not explicitly configured in DB seed
        return new PincodeServiceabilityResponse(
                pincode,
                "India",
                "India",
                "WEST",
                true,
                true,
                true,
                true,
                5,
                2,
                "Serviceable under Standard All-India Delivery"
        );
    }
}
