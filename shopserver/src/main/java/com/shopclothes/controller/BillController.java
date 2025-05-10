package com.shopclothes.controller;

import com.shopclothes.service.bill.IBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/bill")
@RequiredArgsConstructor
public class BillController {

    private final IBillService billService;

    @GetMapping("/export/{orderId}")
    public ResponseEntity<byte[]> exportInvoice(@PathVariable Long orderId) throws IOException {
        byte[] fileBytes = billService.generateBillExcel(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("hoadon_order_" + orderId + ".xlsx").build());

        return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
    }
}

