package com.shopclothes.service.customer;

import com.shopclothes.model.Customer;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface ICustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerById(Long id);
    Customer saveOrUpdateCustomer(Long userId, String firstName,String lastName, String phoneNumber, String address, MultipartFile imageBrand) throws IOException, SQLException;
    Customer updateCustomer(Long id, String firstName,String lastName, String phoneNumber, String address, byte[] photoBytes);
    byte[] getAvatarById(Long customerId) throws SQLException;
    void deleteCustomer(Long id);
}
