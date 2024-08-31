package com.shopclothes.service.order;

import com.shopclothes.dto.CustomerTotalAmountDto;
import com.shopclothes.dto.ProductResponse;
import com.shopclothes.model.*;
import com.shopclothes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderImpl implements IOrderService{
    private final OrderItemRepository orderItemRepository;

    private final CustomerRepository customerRepository;

    private final ProductRepository productRepository;

    private final OrderRepository orderRepository;

    private final SizeQuantityRepository sizeQuantityRepository;



    @Override
    public Order createOrder(Customer customer, List<OrderItem> items) {
        if (customer == null || customerRepository.findById(customer.getId()).isEmpty()) {
            throw new IllegalArgumentException("Customer không tồn tại.");
        }

        String orderCode;
        do {
            orderCode = generateOrderCode();
        } while (orderRepository.existsByOrderCode(orderCode));

        Double totalAmountNow = 0.0;
        // Kiểm tra các sản phẩm
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product ID " + item.getProduct().getId() + " không tồn tại."));
            SizeQuantity sizeQuantity = product.getSizeQuantities().stream()
                    .filter(sq -> sq.getSize().equals(item.getSize()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy size " + item.getSize() + " cho sản phẩm ID " + product.getId()));

            // Kiểm tra số lượng còn lại
            if (sizeQuantity.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Không đủ số lượng cho size " + item.getSize() + " của sản phẩm ID " + product.getId());
            }


            sizeQuantity.setQuantity(sizeQuantity.getQuantity() - item.getQuantity());
            sizeQuantityRepository.save(sizeQuantity);
            // Đảm bảo giá sản phẩm là chính xác
            item.setPrice(product.getPrice());
            item.setSize(sizeQuantity.getSize());

            totalAmountNow += item.getQuantity() *( product.getPrice() - product.getPrice() *(product.getDisCount() / 100));
        }

        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomer(customer);
        order.setItems(items);
        order.setTotalAmount(totalAmountNow);
        order.setStatus("Chờ xác thực");

        items.forEach(item -> item.setOrder(order));

        return orderRepository.save(order);
    }

    private String generateOrderCode() {
        int length = 7;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random random = new Random();
        StringBuilder orderCode = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            orderCode.append(characters.charAt(random.nextInt(characters.length())));
        }

        return orderCode.toString();
    }

    @Override
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
    }

    @Override
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findOrdersByCustomerId(customerId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllOrders();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Override
    public Double calculateTotalAmount(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(item -> {
                    double price = item.getProduct().getPrice();
                    int quantity = item.getQuantity();

                    Double discount = item.getProduct().getDisCount();
                    double finalDiscount = (discount != null) ? discount : 0.0;

                    if (finalDiscount < 0 || finalDiscount > 100) {
                        throw new IllegalArgumentException("Giảm giá không hợp lệ: " + finalDiscount);
                    }

                    // Tính tổng giá sau khi áp dụng giảm giá
                    double totalPrice = price * quantity;
                    double discountMultiplier = 1 - (finalDiscount / 100);
                    return totalPrice * discountMultiplier;
                })
                .sum();
    }



    @Override
    public void deleteOrder(Long orderId) {
        // Kiểm tra nếu order tồn tại
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order không tồn tại với ID: " + orderId);
        }
        // Xóa order
        orderRepository.deleteById(orderId);
    }

    public long getOrdersCountToday() {
        return orderRepository.countOrdersToday();
    }

    public long getOrdersCountThisMonth() {
        return orderRepository.countOrdersThisMonth();
    }

    public long getOrdersCountThisYear() {
        return orderRepository.countOrdersThisYear();
    }

    public long getTotalOrdersCount() {
        return orderRepository.countTotalOrders();
    }

    @Override
    public Double getTotalAmountToday() {
        return orderItemRepository.getTotalAmountToday();
    }

    @Override
    public Double getTotalAmountMonth() {
        return orderItemRepository.getTotalAmountThisMonth();
    }

    @Override
    public Double getTotalAmountYear() {
        return orderItemRepository.getTotalAmountThisYear();
    }

    @Override
    public Double getTotalAmount() {
        return orderItemRepository.getTotalAmountAllTime();
    }


    // Tổng giá trị đơn hàng của khách hàng theo ngày hiện tại
    public List<CustomerTotalAmountDto> getTopCustomersByTotalAmountByToday() {
        List<Object[]> results = orderRepository.findTopCustomersByTotalAmountByToday();
        return results.stream()
                .map(result -> new CustomerTotalAmountDto((Customer) result[0], (Double) result[1]))
                .collect(Collectors.toList());
    }

    // Tổng giá trị đơn hàng của khách hàng theo tháng hiện tại
    public List<CustomerTotalAmountDto> getTopCustomersByTotalAmountByCurrentMonth() {
        List<Object[]> results = orderRepository.findTopCustomersByTotalAmountByCurrentMonth();
        return results.stream()
                .map(result -> new CustomerTotalAmountDto((Customer) result[0], (Double) result[1]))
                .collect(Collectors.toList());
    }

    // Tổng giá trị đơn hàng của khách hàng theo năm hiện tại
    public List<CustomerTotalAmountDto> getTopCustomersByTotalAmountByCurrentYear() {
        List<Object[]> results = orderRepository.findTopCustomersByTotalAmountByCurrentYear();
        return results.stream()
                .map(result -> new CustomerTotalAmountDto((Customer) result[0], (Double) result[1]))
                .collect(Collectors.toList());
    }

    // Tổng giá trị đơn hàng của khách hàng toàn bộ
    public List<CustomerTotalAmountDto> getTopCustomersByTotalAmountOverall() {
        List<Object[]> results = orderRepository.findTopCustomersByTotalAmountOverall();
        return results.stream()
                .map(result -> new CustomerTotalAmountDto((Customer) result[0], (Double) result[1]))
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getTopProductByToday() {
        List<Object[]> results = orderItemRepository.findTop5ProductsByToday();
        return results.stream()
                .map(result -> new ProductResponse((Product) result[0], Math.toIntExact((Long) result[1])))
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getTopProductByMonth() {
        List<Object[]> results = orderItemRepository.findTop5ProductsByCurrentMonth();
        return results.stream()
                .map(result -> new ProductResponse((Product) result[0], Math.toIntExact((Long) result[1])))
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getTopProductByYear() {
        List<Object[]> results = orderItemRepository.findTop5ProductsByCurrentYear();
        return results.stream()
                .map(result -> new ProductResponse((Product) result[0], Math.toIntExact((Long) result[1])))
                .collect(Collectors.toList());
    }
    public List<ProductResponse> getTopProductByAll() {
        List<Object[]> results = orderItemRepository.findTop5ProductsOverall();
        return results.stream()
                .map(result -> new ProductResponse((Product) result[0], Math.toIntExact((Long) result[1])))
                .collect(Collectors.toList());
    }

    public List<Double> getMonthlyRevenue(int year) {
        // Khởi tạo danh sách doanh thu hàng tháng với giá trị mặc định là 0.0
        List<Double> monthlyRevenue = new ArrayList<>(Collections.nCopies(12, 0.0));

        // Lấy danh sách các đơn hàng trong năm
        List<Order> orders = orderRepository.findAllByYear(year);

        // Tính tổng doanh thu của từng tháng
        for (Order order : orders) {
            int month = order.getOrderDate().getMonthValue() - 1; // Tháng 1 là index 0
            double orderTotal = order.getTotalAmount();
            monthlyRevenue.set(month, monthlyRevenue.get(month) + orderTotal);
        }

        return monthlyRevenue;
    }


}
