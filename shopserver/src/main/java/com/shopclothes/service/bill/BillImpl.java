package com.shopclothes.service.bill;

import com.shopclothes.model.Order;
import com.shopclothes.model.OrderItem;
import com.shopclothes.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillImpl implements IBillService {
    private final OrderRepository orderRepository;

    @Override
    public byte[] generateBillExcel(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Hóa đơn");

        int rowNum = 0;

        // Tiêu đề hóa đơn
        Row header = sheet.createRow(rowNum++);
        header.createCell(0).setCellValue("Mã đơn hàng:");
        header.createCell(1).setCellValue(order.getOrderCode());

        Row customerInfo = sheet.createRow(rowNum++);
        customerInfo.createCell(0).setCellValue("Khách hàng:");
        customerInfo.createCell(1).setCellValue(order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName());

        customerInfo = sheet.createRow(rowNum++);
        customerInfo.createCell(0).setCellValue("Số điện thoại:");
        customerInfo.createCell(1).setCellValue(order.getCustomer().getPhoneNumber());

        customerInfo = sheet.createRow(rowNum++);
        customerInfo.createCell(0).setCellValue("Địa chỉ:");
        customerInfo.createCell(1).setCellValue(order.getCustomer().getAddress());

        customerInfo = sheet.createRow(rowNum++);
        customerInfo.createCell(0).setCellValue("Trạng thái thanh toán:");
        customerInfo.createCell(1).setCellValue(order.getPaymentStatus());

        sheet.createRow(rowNum++); // dòng trống

        // Tiêu đề bảng
        Row tableHeader = sheet.createRow(rowNum++);
        tableHeader.createCell(0).setCellValue("STT");
        tableHeader.createCell(1).setCellValue("Tên sản phẩm");
        tableHeader.createCell(2).setCellValue("Giá");
        tableHeader.createCell(3).setCellValue("Số lượng");
        tableHeader.createCell(4).setCellValue("Thành tiền");

        // Căn chỉnh cho tiêu đề bảng
        for (int i = 0; i <= 4; i++) {
            tableHeader.getCell(i).setCellStyle(createHeaderCellStyle(workbook));
        }

        double total = 0;
        List<OrderItem> items = order.getItems();

        for (int i = 0; i < items.size(); i++) {
            OrderItem item = items.get(i);
            Row row = sheet.createRow(rowNum++);

            double price = item.getPrice();
            double totalPerItem = price * item.getQuantity();
            total += totalPerItem;

            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(item.getProduct().getName());
            row.createCell(2).setCellValue(price);
            row.createCell(3).setCellValue(item.getQuantity());
            row.createCell(4).setCellValue(totalPerItem);

            // Căn chỉnh giá trị số
            for (int j = 2; j <= 3; j++) {
                row.getCell(j).setCellStyle(createNumericCellStyle(workbook));
            }
        }

        // Tổng cộng
        sheet.createRow(rowNum++);
        Row totalRow = sheet.createRow(rowNum++);
        totalRow.createCell(3).setCellValue("Tổng cộng:");
        totalRow.createCell(4).setCellValue(total);

        // Căn chỉnh cho tổng cộng
        totalRow.getCell(3).setCellStyle(createHeaderCellStyle(workbook));
        totalRow.getCell(4).setCellStyle(createNumericCellStyle(workbook));

        // Auto fit
        for (int i = 0; i <= 4; i++) sheet.autoSizeColumn(i);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }

    // Tạo kiểu căn chỉnh cho tiêu đề
    private CellStyle createHeaderCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    // Tạo kiểu căn chỉnh cho giá trị số
    private CellStyle createNumericCellStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
}


