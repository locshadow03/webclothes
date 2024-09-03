package com.shopclothes.service.contact;

import com.shopclothes.model.Contact;

import java.util.List;

public interface IContactService {
    Contact addContact(String fullName, String email, String phoneNumber, String message);

    List<Contact> getAllContact();

    void deleteContact(Long id);
}
