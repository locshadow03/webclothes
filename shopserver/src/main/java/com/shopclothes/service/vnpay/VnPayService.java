package com.shopclothes.service.vnpay;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

public class VnPayService {
    private static final String VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private static final String VNP_TMN_CODE = "M7TX7Z2S";
    private static final String VNP_HASH_SECRET = "ST1PS15HFADUR1Y0Q6MFJH17U71N65R6";
    private static final String VNP_IP = "192.168.1.6";

    public String createPaymentUrl(String orderCode, double amount) {
        try {
            Map<String, String> vnpParams = new HashMap<>();
            long orderId = System.currentTimeMillis();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String createDate = formatter.format(new Date());

            vnpParams.put("vnp_Version", "2.1.0");
            vnpParams.put("vnp_TmnCode", VNP_TMN_CODE);
            vnpParams.put("vnp_Amount", String.format("%.0f", amount * 100));
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_CreateDate", createDate);
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_OrderInfo", "Thanh toán đơn hàng " + orderCode);
            vnpParams.put("vnp_OrderType", "billpayment");
            vnpParams.put("vnp_ReturnUrl", "http://localhost:3000/home/my-cart/");
//            vnpParams.put("vnp_TxnRef", String.valueOf(orderId));
            vnpParams.put("vnp_TxnRef", orderCode);
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_IpAddr", VNP_IP);

            String hashData = hashAllParams(vnpParams);
            String secureHash = HMAC_SHA256(VNP_HASH_SECRET, hashData);

            vnpParams.put("vnp_SecureHash", secureHash);

            StringBuilder queryString = new StringBuilder();
            for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
                queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                        .append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                        .append("&");
            }
            queryString.setLength(queryString.length() - 1); // Xóa dấu & cuối

            return VNP_URL + "?" + queryString.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public String hashAllParams(Map<String, String> vnpParams) {
        StringBuilder hashData = new StringBuilder();

        vnpParams.entrySet().stream()
                .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
                .filter(entry -> !entry.getKey().equals("vnp_SecureHash"))
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    hashData.append(entry.getKey())
                            .append("=")
                            .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                            .append("&");
                });

        if (hashData.length() > 0) {
            hashData.setLength(hashData.length() - 1); // Xóa dấu & cuối
        }

        return hashData.toString();
    }

//    public String HMAC_SHA256(String key, String data) {
//        try {
//            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
//            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
//            mac.init(secretKey);
//            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
//            return bytesToHex(hashBytes);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "";
//        }
//    }

    public String HMAC_SHA256(String key, String data) {
        try {
            Mac sha512_HMAC = Mac.getInstance("HmacSHA512");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            sha512_HMAC.init(secret_key);
            byte[] hash = sha512_HMAC.doFinal(data.getBytes());
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            e.printStackTrace();
            return "";
        }
    }

    public String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
