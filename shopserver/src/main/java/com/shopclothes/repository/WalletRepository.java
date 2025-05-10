package com.shopclothes.repository;

import com.shopclothes.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    @Query("SELECT w from Wallet w where w.user.id = :user_id")
    Wallet getWalletByUserId(@Param("user_id") Long user_id);
}
