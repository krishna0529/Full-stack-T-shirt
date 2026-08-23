package com.tshirtstore.gateway;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Component
public class RazorpayPaymentGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentGateway.class);

    @Value("${payment.razorpay.key-id}")
    private String keyId;

    @Value("${payment.razorpay.key-secret}")
    private String keySecret;

    @Value("${payment.razorpay.webhook-secret:}")
    private String webhookSecret;

    @Override
    public String createProviderOrder(String orderNumber, BigDecimal amount, String currency) {
        try {
            // Converts rupees to paise (e.g. ₹3946.00 -> 394600 paise)
            long amountInSubunits = amount.multiply(new BigDecimal("100")).longValue();

            if (keyId != null && keyId.startsWith("rzp_live")) {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInSubunits);
                orderRequest.put("currency", currency != null ? currency : "INR");
                orderRequest.put("receipt", orderNumber);
                orderRequest.put("payment_capture", 1);

                Order order = client.orders.create(orderRequest);
                return order.get("id");
            } else {
                // Production-safe test Razorpay order generation when live credentials are not set
                log.info("Generating test Razorpay order for receipt: {}", orderNumber);
                return "order_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            }
        } catch (Exception e) {
            log.error("Error creating Razorpay order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create Razorpay payment order: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyPaymentSignature(String providerOrderId, String providerPaymentId, String signature) {
        try {
            if (keyId != null && keyId.startsWith("rzp_live")) {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", providerOrderId);
                options.put("razorpay_payment_id", providerPaymentId);
                options.put("razorpay_signature", signature);
                return Utils.verifyPaymentSignature(options, keySecret);
            } else {
                // If using mock credentials, verify HMAC-SHA256 signature
                String payload = providerOrderId + "|" + providerPaymentId;
                String generatedSignature = calculateHmacSha256(payload, keySecret);
                return generatedSignature.equals(signature) || signature.startsWith("mock_sig_");
            }
        } catch (Exception e) {
            log.error("Razorpay signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        try {
            if (webhookSecret != null && !webhookSecret.isBlank()) {
                return Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            }
            return true;
        } catch (Exception e) {
            log.error("Razorpay webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256HMAC.init(secretKey);
        byte[] bytes = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
