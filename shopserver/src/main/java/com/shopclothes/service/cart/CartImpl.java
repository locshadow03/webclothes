package com.shopclothes.service.cart;

import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Cart;
import com.shopclothes.model.CartItem;
import com.shopclothes.model.Customer;
import com.shopclothes.model.Product;
import com.shopclothes.repository.CartItemRepository;
import com.shopclothes.repository.CartRepository;
import com.shopclothes.repository.CustomerRepository;
import com.shopclothes.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartImpl implements ICartService{
    private final CartRepository cartRepository;

    private final CustomerRepository customerRepository;

    private final ProductRepository productRepository;

    private final CartItemRepository cartItemRepository;


    @Override
    public Cart createCart(Long userId) {
        Customer customer = customerRepository.findByUser_Id(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));

        Cart existingCart = cartRepository.findByCustomerId(customer.getId());
        if (existingCart != null) {
            return existingCart;
        }

        Cart cart = new Cart();
        cart.setCustomer(customer);
        return cartRepository.save(cart);
    }

    @Override
    public Optional<Cart> getCartById(Long cartId) {
        return cartRepository.findById(cartId);
    }

    @Override
    public Cart getCartByCustomerId(Long customerId) {
        return cartRepository.findByCustomerId(customerId);
    }

    public Cart addProductToCart(Long cartId, Long productId, int quantity, String size) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng!"));


        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) && item.getSize().equals(size))
                .findFirst()
                .orElse(new CartItem(cart, product, size, quantity, product.getPrice()));


        if (cartItem.getId() != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.setPrice(product.getPrice());
        } else {
            cartItem.setQuantity(quantity);
            cart.setCartItems(new ArrayList<>(cart.getCartItems()));
            cart.getCartItems().add(cartItem);
        }

        return cartRepository.save(cart);
    }


    @Override
    @Transactional
    public void removeProductFromCart(Long cartId, Long cartItemId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng!"));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng!"));

        // Xóa CartItem từ Cart
        cart.getCartItems().remove(cartItem);

        // Xóa CartItem từ cơ sở dữ liệu
        cartItemRepository.delete(cartItem);

        // Lưu lại Cart
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void updateProductQuantity(Long cartId, Long cartItemId, int quantity,  String size) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng!"));
        cart.getCartItems().forEach(item -> {
            if (item.getId().equals(cartItemId)) {
                item.setQuantity(quantity);
                item.setSize(size);
                cartItemRepository.save(item);
            }
        });
    }


}
