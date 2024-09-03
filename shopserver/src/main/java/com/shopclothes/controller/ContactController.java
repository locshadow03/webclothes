package com.shopclothes.controller;

import com.shopclothes.dto.ContactDto;
import com.shopclothes.model.Contact;
import com.shopclothes.service.contact.IContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
        contactDto.setPhoneNumber(contact.getPhoneNumber());
        contactDto.setMessage(contact.getMessage());
        contactDto.setThank("Cảm ơn bạn đã đưa ra sự góp ý chúng tôi sẽ cố gắng khắc phục!");
        return ResponseEntity.ok(contactDto);
    }

    @GetMapping("/all_contact")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactDto>> getAllContact(){
        List<ContactDto> contactDtos = new ArrayList<>();
        List<Contact> contacts = contactService.getAllContact();
        for(Contact contact : contacts){
            ContactDto contactDto = new ContactDto();
            contactDto.setId(contact.getId());
            contactDto.setFullName(contact.getFullName());
            contactDto.setEmail(contact.getEmail());
            contactDto.setPhoneNumber(contact.getPhoneNumber());
            contactDto.setMessage(contact.getMessage());
            contactDto.setCreatedDate(contact.getCreatedDate());
            contactDtos.add(contactDto);
        }

        return ResponseEntity.ok(contactDtos);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id){
        contactService.deleteContact(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
