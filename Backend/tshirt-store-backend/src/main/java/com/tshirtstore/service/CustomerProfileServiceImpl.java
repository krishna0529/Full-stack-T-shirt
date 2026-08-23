package com.tshirtstore.service;

import com.tshirtstore.dto.profile.CustomerProfileResponse;
import com.tshirtstore.dto.profile.UpdateProfileRequest;
import com.tshirtstore.entity.CustomerProfile;
import com.tshirtstore.entity.User;
import com.tshirtstore.repository.CustomerProfileRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerProfileServiceImpl implements CustomerProfileService {

    private final CustomerProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CustomerProfileServiceImpl(CustomerProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private CustomerProfile getOrCreateProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    String initialName = user.getFullName() != null && !user.getFullName().isBlank()
                            ? user.getFullName()
                            : user.getEmail();
                    CustomerProfile newProfile = CustomerProfile.builder()
                            .user(user)
                            .fullName(initialName)
                            .build();
                    return profileRepository.save(newProfile);
                });
    }

    private CustomerProfileResponse mapToResponse(CustomerProfile profile) {
        return new CustomerProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getEmail(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getProfileImageUrl(),
                profile.getDateOfBirth(),
                profile.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile() {
        User user = getCurrentUser();
        CustomerProfile profile = getOrCreateProfile(user);
        return mapToResponse(profile);
    }

    @Override
    public CustomerProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        CustomerProfile profile = getOrCreateProfile(user);

        profile.setFullName(request.fullName().trim());
        if (request.phone() != null) {
            profile.setPhone(request.phone().trim());
        }
        if (request.profileImageUrl() != null) {
            profile.setProfileImageUrl(request.profileImageUrl().trim());
        }
        if (request.dateOfBirth() != null) {
            profile.setDateOfBirth(request.dateOfBirth());
        }

        CustomerProfile updated = profileRepository.save(profile);
        return mapToResponse(updated);
    }
}
