package com.shopclothes.service.bill;

import java.io.IOException;

public interface IBillService {
    byte[] generateBillExcel(Long orderId) throws IOException;
}
