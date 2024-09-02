package com.shopclothes.service.contact;

import com.shopclothes.model.Contact;

public interface IContactService {
    Contact addContact(String fullName, String email, String phoneNumber, String message);
}
