package com.tshirtstore.service;

import com.tshirtstore.dto.address.AddressResponse;
import com.tshirtstore.dto.address.CreateAddressRequest;
import com.tshirtstore.dto.address.UpdateAddressRequest;
import com.tshirtstore.entity.Address;
import com.tshirtstore.entity.User;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.AddressRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found or unauthenticated"));
    }

    private AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getAddressType(),
                address.getFullName(),
                address.getPhone(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getCountry(),
                address.isDefaultAddress()
        );
    }

    private void clearDefaultAddress(Long userId) {
        addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                .ifPresent(address -> {
                    address.setDefaultAddress(false);
                });
    }

    private void makeAnotherAddressDefault(Long userId, Long deletedAddressId) {
        List<Address> addresses = addressRepository.findAllByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId);
        addresses.stream()
                .filter(a -> !a.getId().equals(deletedAddressId))
                .findFirst()
                .ifPresent(a -> {
                    a.setDefaultAddress(true);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses() {
        User user = getCurrentUser();
        return addressRepository.findAllByUserIdOrderByDefaultAddressDescCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses() {
        return getUserAddresses();
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));
        return toResponse(address);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getMyAddress(Long id) {
        return getAddressById(id);
    }

    @Override
    public AddressResponse createAddress(CreateAddressRequest request) {
        User user = getCurrentUser();
        long count = addressRepository.countByUserId(user.getId());

        boolean makeDefault = count == 0 || Boolean.TRUE.equals(request.defaultAddress());

        if (makeDefault) {
            clearDefaultAddress(user.getId());
        }

        Address address = Address.builder()
                .user(user)
                .fullName(request.fullName())
                .phone(request.phone())
                .addressLine1(request.addressLine1())
                .addressLine2(request.addressLine2())
                .city(request.city())
                .state(request.state())
                .postalCode(request.pincode())
                .country(request.country())
                .addressType(request.addressType())
                .defaultAddress(makeDefault)
                .build();

        Address saved = addressRepository.save(address);
        return toResponse(saved);
    }

    @Override
    public AddressResponse updateAddress(Long id, CreateAddressRequest request) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        if (Boolean.TRUE.equals(request.defaultAddress()) && !address.isDefaultAddress()) {
            clearDefaultAddress(user.getId());
            address.setDefaultAddress(true);
        }

        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setAddressLine1(request.addressLine1());
        address.setAddressLine2(request.addressLine2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPincode(request.pincode());
        address.setCountry(request.country());
        address.setAddressType(request.addressType());

        Address updated = addressRepository.save(address);
        return toResponse(updated);
    }

    @Override
    public AddressResponse updateAddress(Long id, UpdateAddressRequest request) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        address.setAddressType(request.addressType());
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setAddressLine1(request.addressLine1());
        address.setAddressLine2(request.addressLine2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPincode(request.pincode());
        address.setCountry(request.country());

        Address updated = addressRepository.save(address);
        return toResponse(updated);
    }

    @Override
    public void deleteAddress(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        boolean wasDefault = address.isDefaultAddress();

        addressRepository.delete(address);

        if (wasDefault) {
            makeAnotherAddressDefault(user.getId(), id);
        }
    }

    @Override
    public AddressResponse setDefaultAddress(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        clearDefaultAddress(user.getId());
        address.setDefaultAddress(true);

        Address updated = addressRepository.save(address);
        return toResponse(updated);
    }
}
