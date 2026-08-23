package com.tshirtstore.controller;

import com.tshirtstore.dto.address.AddressResponse;
import com.tshirtstore.dto.address.CreateAddressRequest;
import com.tshirtstore.dto.address.UpdateAddressRequest;
import com.tshirtstore.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/customer/addresses", "/api/v1/addresses"})
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses() {
        return ResponseEntity.ok(addressService.getMyAddresses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getMyAddress(id));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody CreateAddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAddressRequest request
    ) {
        return ResponseEntity.ok(addressService.updateAddress(id, request));
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefault(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.setDefaultAddress(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
