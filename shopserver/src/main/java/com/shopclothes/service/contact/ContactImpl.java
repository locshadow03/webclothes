package com.shopclothes.service.contact;

import com.shopclothes.model.Contact;
import com.shopclothes.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactImpl implements IContactService{
    private final ContactRepository contactRepository;
    @Override
    public Contact addContact(String fullName, String email, String phoneNumber, String message) {
        Contact contact = new Contact();
        contact.setFullName(fullName);
        contact.setEmail(email);
        contact.setPhoneNumer(phoneNumber);
        contact.setMessage(message);
        return contactRepository.save(contact);
    }
}
