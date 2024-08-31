package com.shopclothes.controller;

import com.shopclothes.dto.BrandDto;
import com.shopclothes.dto.CustomerDto;
import com.shopclothes.dto.ProductDto;
import com.shopclothes.dto.SizeQuantityDto;
import com.shopclothes.extension.PhotoRetrievalExcetion;
import com.shopclothes.extension.ResourceNotFoundException;
import com.shopclothes.model.Brand;
import com.shopclothes.model.Customer;
import com.shopclothes.model.Product;
import com.shopclothes.service.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        Optional<Customer> theCustomer = customerService.getCustomerById(id);

        return theCustomer.map(customer -> {
            CustomerDto customerDto = getCustomerDtoDetail(customer);
            return ResponseEntity.ok(customerDto);
        }).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }
    @PostMapping("/add/{userId}")
    public Customer saveCustomer(@PathVariable Long userId,
                                 @RequestParam("firstName") String firstName,
                                 @RequestParam("lastName") String lastName,
                                 @RequestParam("phoneNumber") String phoneNumber,
                                 @RequestParam("address") String address,
                                 @RequestParam("avatar") MultipartFile avatar) throws SQLException, IOException {

        return customerService.saveOrUpdateCustomer(userId, firstName, lastName, phoneNumber, address,avatar);
    }

    @PutMapping("/update/{id}")
    public Customer updateCustomer(@PathVariable Long id,
                                   @RequestParam("firstName") String firstName,
                                   @RequestParam("lastName") String lastName,
                                   @RequestParam("phoneNumber") String phoneNumber,
                                   @RequestParam("address") String address,
                                   @RequestParam("avatar") MultipartFile avatar) throws IOException, SQLException {
        byte[] photoBytes = avatar != null && !avatar.isEmpty() ? avatar.getBytes() : customerService.getAvatarById(id);
        return customerService.updateCustomer(id,firstName, lastName, phoneNumber, address, photoBytes);
    }


    @DeleteMapping("/delete/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }

    private CustomerDto getCustomerDtoDetail(Customer customer) {
        byte[] photoBytes = null;
        Blob photoBlob = customer.getAvatar();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalExcetion("Error retrieving photo");
            }
        }

        CustomerDto customerDto = new CustomerDto(customer.getId(), customer.getFirstName(), customer.getLastName(), customer.getPhoneNumber(),customer.getAddress(), photoBytes);
        return customerDto;
    }
}
