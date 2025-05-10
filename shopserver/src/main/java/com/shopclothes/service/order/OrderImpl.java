package com.shopclothes.service.order;

import com.shopclothes.dto.CustomerTotalAmountDto;
import com.shopclothes.dto.ProductResponse;
import com.shopclothes.dto.event.DiscountAndPercentage;
import com.shopclothes.model.*;
import com.shopclothes.repository.*;
import com.shopclothes.service.event.IDiscountEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

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

    private final ColorImageProductRepository colorImageProductRepository;

    private final IDiscountEventService discountEventService;

    private final WalletRepository walletRepository;



    @Override
    public Order createOrder(Customer customer, List<OrderItem> items, String paymentMethod) {
        if (customer == null || customerRepository.findById(customer.getId()).isEmpty()) {
            throw new IllegalArgumentException("Customer không tồn tại.");
        }

        Optional<Customer> customerNow = customerRepository.findById(customer.getId());

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
            int quantity = colorImageProductRepository.getQuanityByIdColorAndSizeQuantity(item.getColor(), sizeQuantity.getId()).getQuantity();
            if (quantity < item.getQuantity()) {
                throw new IllegalArgumentException("Không đủ số lượng cho size " + item.getSize() + " của sản phẩm ID " + product.getId());
            }


//            sizeQuantity.setQuantity(sizeQuantity.getQuantity() - item.getQuantity());

            ColorImageProduct colorImageProduct = colorImageProductRepository.getQuanityByIdColorAndSizeQuantity(item.getColor(), sizeQuantity.getId());
            colorImageProduct.setQuantity(quantity - item.getQuantity());
            colorImageProductRepository.save(colorImageProduct);
            // Đảm bảo giá sản phẩm là chính xác
            DiscountAndPercentage disCountProduct = discountEventService.getDisCountProductNowByProductId(product.getId());
            item.setPrice(product.getPrice() - product.getPrice() *(disCountProduct.getDiscount() / 100));
            if(disCountProduct.isPercentage()){
                item.setPrice( product.getPrice() - product.getPrice() *(disCountProduct.getDiscount() / 100));
            } else{
                item.setPrice( product.getPrice() - disCountProduct.getDiscount());
            }
            item.setSize(sizeQuantity.getSize());
            item.setColor(colorImageProduct.getColor());
            if(disCountProduct.isPercentage()){
                totalAmountNow += item.getQuantity() *( product.getPrice() - product.getPrice() *(disCountProduct.getDiscount() / 100));
            } else{
                totalAmountNow += item.getQuantity() *( product.getPrice() - disCountProduct.getDiscount());
            }
        }
        PaymentMethod method = PaymentMethod.valueOf(paymentMethod.toUpperCase());
        if (method == PaymentMethod.COD) {
            Order order = new Order();
            order.setOrderCode(orderCode);
            order.setCustomer(customer);
            order.setItems(items);
            order.setTotalAmount(totalAmountNow);
            order.setStatus("Chờ xác thực");
            order.setPaymentStatus("Chưa thanh toán");
            order.setPaymentMethod(PaymentMethod.COD);

            items.forEach(item -> item.setOrder(order));

            return orderRepository.save(order);
        } else if (method == PaymentMethod.VNPAY) {
            Order order = new Order();
            order.setOrderCode(orderCode);
            order.setCustomer(customer);
            order.setItems(items);
            order.setTotalAmount(totalAmountNow);
            order.setStatus("Chờ xác thực");
            order.setPaymentMethod(PaymentMethod.VNPAY);
            order.setPaymentStatus("Đã thanh toán");
            items.forEach(item -> item.setOrder(order));

            return orderRepository.save(order);
        } else if (method == PaymentMethod.E_WALLET) {
            Order order = new Order();
            order.setOrderCode(orderCode);
            order.setCustomer(customer);
            order.setItems(items);
            order.setTotalAmount(totalAmountNow);
            order.setStatus("Chờ xác thực");
            order.setPaymentMethod(PaymentMethod.E_WALLET);
            order.setPaymentStatus("Đã thanh toán");
            items.forEach(item -> item.setOrder(order));

            Wallet wallet = walletRepository.getWalletByUserId(customerNow.get().getUser().getId());
            if(wallet.getBalance() >= totalAmountNow){
                wallet.setBalance(wallet.getBalance() - totalAmountNow);
                walletRepository.save(wallet);
            }

            return orderRepository.save(order);
        }
        return null;
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
        Optional<Order> order = orderRepository.findById(orderId);
        if("Đã thanh toán".equals(order.get().getPaymentStatus())){
            Wallet wallet = walletRepository.getWalletByUserId(order.get().getCustomer().getUser().getId());
            System.out.println(wallet.getBalance());
            wallet.setBalance(wallet.getBalance() + order.get().getTotalAmount());
            walletRepository.save(wallet);
        }

        for (OrderItem item : order.get().getItems()) {
            Product product = item.getProduct();
            String size = item.getSize();
            String color = item.getColor();  // nếu bạn có lưu màu sắc trong OrderItem
            int quantity = item.getQuantity();

            SizeQuantity sizeQuantity = sizeQuantityRepository.findByProductAndSize(product, size)
                    .orElseThrow(() -> new RuntimeException("Size not found"));
            ColorImageProduct cip = colorImageProductRepository
                    .findBySizeQuantityAndColor(sizeQuantity, color)
                    .orElseThrow(() -> new RuntimeException("Color not found"));

            cip.setQuantity(cip.getQuantity() + quantity);
            colorImageProductRepository.save(cip);
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
