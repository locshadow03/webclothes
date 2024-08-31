package com.shopclothes.service.cart;

import com.shopclothes.model.Cart;
import com.shopclothes.model.Product;

import java.util.Optional;

public interface ICartService {
    Cart createCart(Long customerId);

    Optional<Cart> getCartById(Long cartId);

    Cart getCartByCustomerId(Long customerId);

    Cart addProductToCart(Long cartId, Long productId, int quantity,  String size);

    void removeProductFromCart(Long cartId, Long cartItemId);

    void updateProductQuantity(Long cartId, Long cartItemId, int quantity,  String size);
}
