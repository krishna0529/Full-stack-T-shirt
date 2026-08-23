package com.tshirtstore.service;

import com.tshirtstore.dto.address.AddressResponse;
import com.tshirtstore.dto.address.CreateAddressRequest;
import com.tshirtstore.dto.address.UpdateAddressRequest;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses();
    List<AddressResponse> getMyAddresses();

    AddressResponse getAddressById(Long id);
    AddressResponse getMyAddress(Long id);

    AddressResponse createAddress(CreateAddressRequest request);

    AddressResponse updateAddress(Long id, CreateAddressRequest request);
    AddressResponse updateAddress(Long id, UpdateAddressRequest request);

    void deleteAddress(Long id);
    AddressResponse setDefaultAddress(Long id);
}
