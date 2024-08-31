package com.shopclothes.repository;

import com.shopclothes.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT SUM(oi.quantity * (p.price - p.price * (COALESCE(p.disCount, 0))/100)) FROM OrderItem oi JOIN oi.product p JOIN oi.order o WHERE DATE(o.orderDate) = CURRENT_DATE")
    Double getTotalAmountToday();

    @Query("SELECT SUM(oi.quantity * (p.price - p.price * (COALESCE(p.disCount, 0))/100)) FROM OrderItem oi JOIN oi.product p JOIN oi.order o WHERE FUNCTION('MONTH', o.orderDate) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE)")
    Double getTotalAmountThisMonth();

    @Query("SELECT SUM(oi.quantity * (p.price - p.price * (COALESCE(p.disCount, 0))/100)) FROM OrderItem oi JOIN oi.product p JOIN oi.order o WHERE FUNCTION('YEAR', o.orderDate) = FUNCTION('YEAR', CURRENT_DATE)")
    Double getTotalAmountThisYear();

    @Query("SELECT SUM(oi.quantity * (p.price - p.price * (COALESCE(p.disCount, 0))/100)) FROM OrderItem oi JOIN oi.product p JOIN oi.order o")
    Double getTotalAmountAllTime();

    @Query("SELECT oi.product, SUM(oi.quantity) FROM OrderItem oi WHERE FUNCTION('DATE', oi.order.orderDate) = FUNCTION('DATE', CURRENT_DATE) GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTop5ProductsByToday();

    @Query("SELECT oi.product, SUM(oi.quantity) FROM OrderItem oi WHERE FUNCTION('MONTH', oi.order.orderDate) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', oi.order.orderDate) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTop5ProductsByCurrentMonth();

    @Query("SELECT oi.product, SUM(oi.quantity) FROM OrderItem oi WHERE FUNCTION('YEAR', oi.order.orderDate) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTop5ProductsByCurrentYear();

    @Query("SELECT oi.product, SUM(oi.quantity) FROM OrderItem oi GROUP BY oi.product ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTop5ProductsOverall();


}
