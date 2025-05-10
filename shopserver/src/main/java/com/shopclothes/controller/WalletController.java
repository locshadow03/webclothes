package com.shopclothes.controller;

import com.shopclothes.dto.WalletDto;
import com.shopclothes.model.Wallet;
import com.shopclothes.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wallet")
public class WalletController {
    private final WalletRepository walletRepository;
    @GetMapping("/{userId}")
    public ResponseEntity<WalletDto> getWalletBalance(@PathVariable Long userId) {
        Wallet wallet = walletRepository.getWalletByUserId(userId);
        WalletDto walletDto = new WalletDto();
        walletDto.setId(wallet.getId());
        walletDto.setBalance(wallet.getBalance());
        return ResponseEntity.ok(walletDto);
    }

}
