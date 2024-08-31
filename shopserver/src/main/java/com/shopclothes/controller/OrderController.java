package com.shopclothes.controller;


import com.shopclothes.dto.*;
import com.shopclothes.model.Customer;
import com.shopclothes.model.Order;
import com.shopclothes.model.OrderItem;
import com.shopclothes.repository.CustomerRepository;
import com.shopclothes.service.order.IOrderService;
import com.shopclothes.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {
    private final IOrderService orderService;
    private final CustomerRepository customerRepository;
    private final IProductService productService;


    @PostMapping("/add-order")
    public ResponseEntity<OrderDto> createOrder(@RequestBody CreateOrderRequest request) {
        Customer customer = request.getCustomer();
        List<OrderItem> items = request.getItems();
        Customer existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer không tồn tại."));
        existingCustomer.setFirstName(customer.getFirstName());
        existingCustomer.setLastName(customer.getLastName());
        existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        existingCustomer.setAddress(customer.getAddress());

        customerRepository.save(existingCustomer);

        Order order = orderService.createOrder(customer, items);
        OrderDto orderDto = new OrderDto();
        orderDto.setCustomerId(order.getCustomer().getId());
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setStatusOrder(order.getStatus());
        return ResponseEntity.ok(orderDto);
    }

    @GetMapping("/all-order")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderDto> orderDtos = new ArrayList<>();

        for(Order order : orders){
            OrderDto orderDto = new OrderDto();
            orderDto.setOrderId(order.getId());
            orderDto.setCustomerId(order.getCustomer().getId());
            orderDto.setOrderCode(order.getOrderCode());
            orderDto.setFirstName(order.getCustomer().getFirstName());
            orderDto.setPhoneNumber(order.getCustomer().getPhoneNumber());
            orderDto.setAddress(order.getCustomer().getAddress());
            orderDto.setStatusOrder(order.getStatus());
            orderDto.setTotalAmount(orderService.calculateTotalAmount(order.getItems()));
            orderDto.setOrderDate(order.getOrderDate());
            orderDtos.add(orderDto);
        }
        return ResponseEntity.ok(orderDtos);
    }

    @PutMapping("/update-status/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId, @RequestParam("status") String status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        OrderDto orderDto = new OrderDto();
        orderDto.setOrderId(updatedOrder.getId());
        orderDto.setCustomerId(updatedOrder.getCustomer().getId());
        orderDto.setOrderCode(updatedOrder.getOrderCode());
        orderDto.setFirstName(updatedOrder.getCustomer().getFirstName());
        orderDto.setPhoneNumber(updatedOrder.getCustomer().getPhoneNumber());
        orderDto.setAddress(updatedOrder.getCustomer().getAddress());
        orderDto.setStatusOrder(updatedOrder.getStatus());
        orderDto.setTotalAmount(orderService.calculateTotalAmount(updatedOrder.getItems()));
        orderDto.setOrderDate(updatedOrder.getOrderDate());

        return ResponseEntity.ok(orderDto);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId) {
        Order order = orderService.getOrder(orderId);
        OrderDto orderDto = new OrderDto();
        orderDto.setOrderId(order.getId());
        orderDto.setCustomerId(order.getCustomer().getId());
        orderDto.setOrderCode(order.getOrderCode());
        orderDto.setFirstName(order.getCustomer().getFirstName());
        orderDto.setLastName(order.getCustomer().getLastName());
        orderDto.setPhoneNumber(order.getCustomer().getPhoneNumber());
        orderDto.setAddress(order.getCustomer().getAddress());
        orderDto.setStatusOrder(order.getStatus());
        orderDto.setTotalAmount(orderService.calculateTotalAmount(order.getItems()));
        orderDto.setOrderDate(order.getOrderDate());
        List<OrderItemDto> orderItemsDto = order.getItems().stream().map(item -> {
            OrderItemDto dto = new OrderItemDto();
            byte[] photoBytes = new byte[0];
            try {
                photoBytes = productService.getProductPhotoById(item.getProduct().getId());
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                dto.setImageProduct(base64Photo);
            }
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setSize(item.getSize());
            dto.setQuantity(item.getQuantity());
            dto.setDisCount(item.getProduct().getDisCount());
            dto.setPrice(item.getProduct().getPrice());
            return dto;
        }).collect(Collectors.toList());

        orderDto.setOrderItems(orderItemsDto);
        return ResponseEntity.ok(orderDto);
    }

    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        List<OrderDto> orderDtos = new ArrayList<>();

        for(Order order : orders) {
            OrderDto orderDto = new OrderDto();
            orderDto.setOrderId(order.getId());
            orderDto.setCustomerId(order.getCustomer().getId());
            orderDto.setOrderCode(order.getOrderCode());
            orderDto.setFirstName(order.getCustomer().getFirstName());
            orderDto.setPhoneNumber(order.getCustomer().getPhoneNumber());
            orderDto.setAddress(order.getCustomer().getAddress());
            orderDto.setStatusOrder(order.getStatus());
            orderDto.setTotalAmount(orderService.calculateTotalAmount(order.getItems()));
            orderDto.setOrderDate(order.getOrderDate());
            orderDtos.add(orderDto);
        }

        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/count_order")
    public ResponseEntity<CountOrderDto> getcountOrder(){
        CountOrderDto countOrderDto = new CountOrderDto();

        countOrderDto.setCountDate(orderService.getOrdersCountToday());
        countOrderDto.setCountMonth(orderService.getOrdersCountThisMonth());
        countOrderDto.setCountYear(orderService.getOrdersCountThisYear());
        countOrderDto.setCountTotal(orderService.getTotalOrdersCount());

        return ResponseEntity.ok(countOrderDto);
    }

    @GetMapping("/total_amount")
    public ResponseEntity<TotalAmountDto> getTotalAmount(){
        TotalAmountDto totalAmountDto = new TotalAmountDto();

        totalAmountDto.setTotalAmountToday(orderService.getTotalAmountToday());
        totalAmountDto.setTotalAmountThisMonth(orderService.getTotalAmountMonth());
        totalAmountDto.setTotalAmountThisYear(orderService.getTotalAmountYear());
        totalAmountDto.setTotalAmountAllTime(orderService.getTotalAmount());
        return ResponseEntity.ok(totalAmountDto);
    }

    @GetMapping("/top-customers/today")
    public ResponseEntity<List<TopCustomerDto>> getTopCustomersByTotalAmountByToday() {
        List<CustomerTotalAmountDto> customerTotalAmountDtos = orderService.getTopCustomersByTotalAmountByToday();
        List<TopCustomerDto> topCustomerDtos = new ArrayList<>();
        for(CustomerTotalAmountDto customerTotalAmountDto : customerTotalAmountDtos){
            TopCustomerDto topCustomerDto = new TopCustomerDto();
            topCustomerDto.setId(customerTotalAmountDto.getCustomer().getId());
            topCustomerDto.setLastName(customerTotalAmountDto.getCustomer().getLastName());
            topCustomerDto.setFirstName(customerTotalAmountDto.getCustomer().getFirstName());
            topCustomerDto.setPhoneNumber(customerTotalAmountDto.getCustomer().getPhoneNumber());
            topCustomerDto.setAddress(customerTotalAmountDto.getCustomer().getAddress());
            topCustomerDto.setTotalAmount(customerTotalAmountDto.getTotalAmount());
            topCustomerDtos.add(topCustomerDto);
        }
        return ResponseEntity.ok(topCustomerDtos);
    }

    @GetMapping("/top-customers/month")
    public ResponseEntity<List<TopCustomerDto>> getTopCustomersByTotalAmountByCurrentMonth() {
        List<CustomerTotalAmountDto> customerTotalAmountDtos = orderService.getTopCustomersByTotalAmountByCurrentMonth();
        List<TopCustomerDto> topCustomerDtos = new ArrayList<>();
        for(CustomerTotalAmountDto customerTotalAmountDto : customerTotalAmountDtos){
            TopCustomerDto topCustomerDto = new TopCustomerDto();
            topCustomerDto.setId(customerTotalAmountDto.getCustomer().getId());
            topCustomerDto.setLastName(customerTotalAmountDto.getCustomer().getLastName());
            topCustomerDto.setFirstName(customerTotalAmountDto.getCustomer().getFirstName());
            topCustomerDto.setPhoneNumber(customerTotalAmountDto.getCustomer().getPhoneNumber());
            topCustomerDto.setAddress(customerTotalAmountDto.getCustomer().getAddress());
            topCustomerDto.setTotalAmount(customerTotalAmountDto.getTotalAmount());
            topCustomerDtos.add(topCustomerDto);
        }
        return ResponseEntity.ok(topCustomerDtos);
    }

    @GetMapping("/top-customers/year")
    public ResponseEntity<List<TopCustomerDto>> getTopCustomersByTotalAmountByCurrentYear() {
        List<CustomerTotalAmountDto> customerTotalAmountDtos = orderService.getTopCustomersByTotalAmountByCurrentYear();
        List<TopCustomerDto> topCustomerDtos = new ArrayList<>();
        for(CustomerTotalAmountDto customerTotalAmountDto : customerTotalAmountDtos){
            TopCustomerDto topCustomerDto = new TopCustomerDto();
            topCustomerDto.setId(customerTotalAmountDto.getCustomer().getId());
            topCustomerDto.setLastName(customerTotalAmountDto.getCustomer().getLastName());
            topCustomerDto.setFirstName(customerTotalAmountDto.getCustomer().getFirstName());
            topCustomerDto.setPhoneNumber(customerTotalAmountDto.getCustomer().getPhoneNumber());
            topCustomerDto.setAddress(customerTotalAmountDto.getCustomer().getAddress());
            topCustomerDto.setTotalAmount(customerTotalAmountDto.getTotalAmount());

            topCustomerDtos.add(topCustomerDto);
        }
        return ResponseEntity.ok(topCustomerDtos);
    }

    @GetMapping("/top-customers")
    public ResponseEntity<List<TopCustomerDto>> getTopCustomersByTotalAmountOverall() {
        List<CustomerTotalAmountDto> customerTotalAmountDtos = orderService.getTopCustomersByTotalAmountOverall();
        List<TopCustomerDto> topCustomerDtos = new ArrayList<>();
        for(CustomerTotalAmountDto customerTotalAmountDto : customerTotalAmountDtos){
            TopCustomerDto topCustomerDto = new TopCustomerDto();
            topCustomerDto.setId(customerTotalAmountDto.getCustomer().getId());
            topCustomerDto.setLastName(customerTotalAmountDto.getCustomer().getLastName());
            topCustomerDto.setFirstName(customerTotalAmountDto.getCustomer().getFirstName());
            topCustomerDto.setPhoneNumber(customerTotalAmountDto.getCustomer().getPhoneNumber());
            topCustomerDto.setAddress(customerTotalAmountDto.getCustomer().getAddress());
            topCustomerDto.setTotalAmount(customerTotalAmountDto.getTotalAmount());

            topCustomerDtos.add(topCustomerDto);
        }
        return ResponseEntity.ok(topCustomerDtos);
    }

    @GetMapping("/top-products/today")
    public ResponseEntity<List<TopProductOrderDto>> getTopProductOrderByToday() throws SQLException {
        List<ProductResponse> productResponses = orderService.getTopProductByToday();
        List<TopProductOrderDto> topProductOrderDtos = new ArrayList<>();

        for(ProductResponse productResponse : productResponses){
            TopProductOrderDto topProductOrderDto = new TopProductOrderDto();

            topProductOrderDto.setId(productResponse.getProduct().getId());
            topProductOrderDto.setNameProduct(productResponse.getProduct().getName());
            topProductOrderDto.setPrice(productResponse.getProduct().getPrice());
            topProductOrderDto.setDiscount(productResponse.getProduct().getDisCount());
            byte[] photoBytes = productService.getProductPhotoById(productResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topProductOrderDto.setImg(base64Photo);
            }
            topProductOrderDto.setTotalProductOrder(productResponse.getTotalProduct());

            topProductOrderDtos.add(topProductOrderDto);

        }
        return ResponseEntity.ok(topProductOrderDtos);
    }

    @GetMapping("/top-products/month")
    public ResponseEntity<List<TopProductOrderDto>> getTopProductOrderByMonth() throws SQLException {
        List<ProductResponse> productResponses = orderService.getTopProductByMonth();
        List<TopProductOrderDto> topProductOrderDtos = new ArrayList<>();

        for(ProductResponse productResponse : productResponses){
            TopProductOrderDto topProductOrderDto = new TopProductOrderDto();

            topProductOrderDto.setId(productResponse.getProduct().getId());
            topProductOrderDto.setNameProduct(productResponse.getProduct().getName());
            topProductOrderDto.setPrice(productResponse.getProduct().getPrice());
            topProductOrderDto.setDiscount(productResponse.getProduct().getDisCount());
            byte[] photoBytes = productService.getProductPhotoById(productResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topProductOrderDto.setImg(base64Photo);
            }
            topProductOrderDto.setTotalProductOrder(productResponse.getTotalProduct());

            topProductOrderDtos.add(topProductOrderDto);

        }
        return ResponseEntity.ok(topProductOrderDtos);
    }

    @GetMapping("/top-products/year")
    public ResponseEntity<List<TopProductOrderDto>> getTopProductOrderByYear() throws SQLException {
        List<ProductResponse> productResponses = orderService.getTopProductByYear();
        List<TopProductOrderDto> topProductOrderDtos = new ArrayList<>();

        for(ProductResponse productResponse : productResponses){
            TopProductOrderDto topProductOrderDto = new TopProductOrderDto();

            topProductOrderDto.setId(productResponse.getProduct().getId());
            topProductOrderDto.setNameProduct(productResponse.getProduct().getName());
            topProductOrderDto.setPrice(productResponse.getProduct().getPrice());
            topProductOrderDto.setDiscount(productResponse.getProduct().getDisCount());
            byte[] photoBytes = productService.getProductPhotoById(productResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topProductOrderDto.setImg(base64Photo);
            }
            topProductOrderDto.setTotalProductOrder(productResponse.getTotalProduct());

            topProductOrderDtos.add(topProductOrderDto);

        }
        return ResponseEntity.ok(topProductOrderDtos);
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductOrderDto>> getTopProductOrderByAll() throws SQLException {
        List<ProductResponse> productResponses = orderService.getTopProductByAll();
        List<TopProductOrderDto> topProductOrderDtos = new ArrayList<>();

        for(ProductResponse productResponse : productResponses){
            TopProductOrderDto topProductOrderDto = new TopProductOrderDto();

            topProductOrderDto.setId(productResponse.getProduct().getId());
            topProductOrderDto.setNameProduct(productResponse.getProduct().getName());
            topProductOrderDto.setPrice(productResponse.getProduct().getPrice());
            topProductOrderDto.setDiscount(productResponse.getProduct().getDisCount());
            byte[] photoBytes = productService.getProductPhotoById(productResponse.getProduct().getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                topProductOrderDto.setImg(base64Photo);
            }
            topProductOrderDto.setTotalProductOrder(productResponse.getTotalProduct());

            topProductOrderDtos.add(topProductOrderDto);

        }
        return ResponseEntity.ok(topProductOrderDtos);
    }

    @GetMapping("/chart")
    public ResponseEntity<List<Double>> getMonthlyRevenue(@RequestParam int year) {
        List<Double> revenue = orderService.getMonthlyRevenue(year);
        return ResponseEntity.ok(revenue);
    }

}
