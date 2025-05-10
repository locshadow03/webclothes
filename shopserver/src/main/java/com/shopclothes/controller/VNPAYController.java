package com.shopclothes.controller;

import com.shopclothes.service.vnpay.VnPayService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment/vnpay")
public class VNPAYController {

    private final VnPayService vnPayService = new VnPayService();

    @PostMapping("/create")
    public String createPaymentUrl(@RequestParam("orderCode") String orderCode, @RequestParam("amount") double amount) {
        // Sử dụng createPaymentUrl để tạo URL thanh toán
        String paymentUrl = vnPayService.createPaymentUrl(orderCode, amount);

        // Trả về URL thanh toán cho frontend
        return paymentUrl;
    }
}
