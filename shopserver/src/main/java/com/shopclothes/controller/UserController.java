package com.shopclothes.controller;

import com.shopclothes.dto.TotalUser;
import com.shopclothes.dto.UserDto;
import com.shopclothes.extension.UserNotFoundException;
import com.shopclothes.service.user.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/users")
public class UserController {

    private final UserServiceImpl userService;

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<UserDto> userDto = userService.getUserById(id);
        return userDto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/allUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> userDtos = userService.allUser();
        return ResponseEntity.ok(userDtos);
    }

    @DeleteMapping("/delete/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) throws UserNotFoundException {
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/update/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable Long userId,@RequestParam("role") String role) throws UserNotFoundException {
        userService.updateRole(userId, role);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("total_user")
    public ResponseEntity<TotalUser> getTotalUser(){
        TotalUser totalUser = new TotalUser();
        totalUser.setTotalUserToday(userService.getCountUsersToday());
        totalUser.setTotalUserMonth(userService.getCountUsersThisMonth());
        totalUser.setTotalUserYear(userService.getCountUsersThisYear());
        totalUser.setTotalUserAll(userService.getCountUsersAllTime());

        return ResponseEntity.ok(totalUser);
    }

}
