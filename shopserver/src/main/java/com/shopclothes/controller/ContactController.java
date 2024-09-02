package com.shopclothes.controller;

import com.shopclothes.dto.ContactDto;
import com.shopclothes.model.Contact;
import com.shopclothes.service.contact.IContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/contact")
public class ContactController {
    private final IContactService contactService;

    @PostMapping("/add_contact")
    public ResponseEntity<ContactDto> addContact(@RequestParam("fullName") String fullName,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("phoneNumber") String phoneNumber,
                                                 @RequestParam("message") String message
                                                 ){
        Contact contact = contactService.addContact(fullName, email, phoneNumber, message);
        ContactDto contactDto = new ContactDto();
        contactDto.setId(contact.getId());
        contactDto.setFullName(contact.getFullName());
        contactDto.setEmail(contact.getEmail());
        contactDto.setPhoneNumer(contact.getPhoneNumer());
        contactDto.setMessage(contact.getMessage());
        contactDto.setThank("Cảm ơn bạn đã đưa ra sự góp ý chúng tôi sẽ cố gắng khắc phục!");
        return ResponseEntity.ok(contactDto);
    }
}
