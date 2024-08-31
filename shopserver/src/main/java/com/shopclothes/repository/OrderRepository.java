package com.shopclothes.repository;

import com.shopclothes.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByOrderCode(String orderCode);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId")
    List<Order> findOrdersByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT o FROM Order o")
    List<Order> findAllOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.orderDate) = CURRENT_DATE")
    long countOrdersToday();

    @Query("SELECT COUNT(o) FROM Order o WHERE FUNCTION('MONTH', o.orderDate) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE)")
    long countOrdersThisMonth();

    @Query("SELECT COUNT(o) FROM Order o WHERE FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE)")
    long countOrdersThisYear();

    @Query("SELECT COUNT(o) FROM Order o")
    long countTotalOrders();

    @Query("SELECT o FROM Order o WHERE YEAR(o.orderDate) = :year")
    List<Order> findAllByYear(@Param("year") int year);

    @Query("SELECT o.customer, SUM(o.totalAmount) FROM Order o WHERE FUNCTION('DATE', o.orderDate) = FUNCTION('CURRENT_DATE') GROUP BY o.customer ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> findTopCustomersByTotalAmountByToday();

    @Query("SELECT o.customer, SUM(o.totalAmount) FROM Order o WHERE FUNCTION('MONTH', o.orderDate) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY o.customer ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> findTopCustomersByTotalAmountByCurrentMonth();

    @Query("SELECT o.customer, SUM(o.totalAmount) FROM Order o WHERE FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY o.customer ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> findTopCustomersByTotalAmountByCurrentYear();

    @Query("SELECT o.customer, SUM(o.totalAmount) FROM Order o GROUP BY o.customer ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> findTopCustomersByTotalAmountOverall();

}
