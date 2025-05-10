package com.shopclothes.controller;

import com.shopclothes.service.vnpay.VnPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment/vnpay")
public class VNPAYCallbackController {

    private final VnPayService vnPayService = new VnPayService();

    @GetMapping("/result")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            String vnpResponseCode = params.get("vnp_ResponseCode");
            String vnpSecureHash = params.get("vnp_SecureHash");
            String orderCode = params.get("vnp_TxnRef");
            String hashData = vnPayService.hashAllParams(params);
            String myHash = vnPayService.HMAC_SHA256("ST1PS15HFADUR1Y0Q6MFJH17U71N65R6", hashData);
            System.out.println("HashData: " + hashData);
            System.out.println("MyHash: " + myHash);
            System.out.println("VNPay Hash: " + vnpSecureHash);
            if ("00".equals(vnpResponseCode) && myHash.equals(vnpSecureHash)) {

                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Thanh toán thành công",
                        "orderCode", orderCode
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "status", "failed",
                        "message", "Thanh toán thất bại hoặc mã bảo mật sai"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Lỗi khi xử lý kết quả thanh toán"
            ));
        }
    }


}

