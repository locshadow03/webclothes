package com.shopclothes.model;

public enum PaymentMethod {
    COD ("Thanh toán khi nhận hàng"),
    E_WALLET ("Thanh toán qua ví điện tử"),
    VNPAY ("Thanh toán qua VNPay");

    private String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
