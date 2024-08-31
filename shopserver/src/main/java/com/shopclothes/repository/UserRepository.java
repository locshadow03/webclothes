package com.shopclothes.repository;

import com.shopclothes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT COUNT(u) FROM User u WHERE FUNCTION('DATE', u.createdAt) = FUNCTION('DATE', CURRENT_DATE)")
    Long countUsersToday();

    @Query("SELECT COUNT(u) FROM User u WHERE FUNCTION('MONTH', u.createdAt) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', u.createdAt) = FUNCTION('YEAR', CURRENT_DATE)")
    Long countUsersThisMonth();

    @Query("SELECT COUNT(u) FROM User u WHERE FUNCTION('YEAR', u.createdAt) = FUNCTION('YEAR', CURRENT_DATE)")
    Long countUsersThisYear();

    @Query("SELECT COUNT(u) FROM User u")
    Long countUsersAllTime();


}
