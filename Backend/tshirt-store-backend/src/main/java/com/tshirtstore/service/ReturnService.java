package com.tshirtstore.service;

import com.tshirtstore.dto.returnreq.CreateReturnRequest;
import com.tshirtstore.dto.returnreq.ReturnEligibilityResponse;
import com.tshirtstore.dto.returnreq.ReturnResponse;
import com.tshirtstore.entity.QualityCheckResult;
import com.tshirtstore.entity.ReturnStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReturnService {

    ReturnEligibilityResponse checkEligibility(Long orderId);

    ReturnResponse createReturn(CreateReturnRequest request);

    Page<ReturnResponse> getUserReturns(Pageable pageable);

    ReturnResponse getReturnById(Long returnId);

    ReturnResponse cancelReturn(Long returnId);

    Page<ReturnResponse> getAdminReturns(ReturnStatus status, Pageable pageable);

    ReturnResponse approveReturn(Long returnId);

    ReturnResponse rejectReturn(Long returnId);

    ReturnResponse processQualityCheck(Long returnId, QualityCheckResult result);

    ReturnResponse processRefund(Long returnId);
}
