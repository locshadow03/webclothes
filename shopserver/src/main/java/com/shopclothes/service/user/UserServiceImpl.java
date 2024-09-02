package com.shopclothes.service.user;

import com.shopclothes.dto.UserDto;
import com.shopclothes.extension.UserNotFoundException;
import com.shopclothes.model.Role;
import com.shopclothes.model.User;
import com.shopclothes.repository.RoleRepository;
import com.shopclothes.repository.UserRepository;
import com.shopclothes.service.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService{
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;


    @Override
    public UserDto register(UserDto registrationRequest) {
        UserDto userDto = new UserDto();

        try{
            if (userRepository.existsByUsername(registrationRequest.getUsername())) {
                userDto.setStatusCode(400);
                userDto.setMessage("Username hoặc Email đã được sử dụng!");
                return userDto;
            }
            if (userRepository.existsByEmail(registrationRequest.getEmail())) {
                userDto.setStatusCode(400);
                userDto.setMessage("Username hoặc Email đã được sử dụng!");
                return userDto;
            }
            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setUsername(registrationRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            user.setRoles(Arrays.asList(roleRepository.findByName("USER")));
            User userResult = userRepository.save(user);
            if(userResult.getId() > 0){
                userDto.setOurUsers((userResult));
                userDto.setMessage("User Saved Successfully");
                userDto.setStatusCode(200);
            }
        } catch(Exception e){
            userDto.setStatusCode(500);
            userDto.setError(e.getMessage());
        }
        return userDto;
    }

    @Override
    public UserDto login(UserDto loginRequest){
        UserDto response = new UserDto();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + loginRequest.getUsername()));

            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setId(user.getId());
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setUsername(user.getUsername());
            response.setRole(user.getRoles().toString());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");
        } catch (UsernameNotFoundException e) {
            response.setStatusCode(404);
            response.setMessage("Không tồn tại tài khoản: " + loginRequest.getUsername());
        } catch (Exception e){
            response.setStatusCode(401);
            response.setMessage("Sai username or password");
        }
        return response;
    }

    public UserDto refreshToken(UserDto refreshTokenRequest) {
        UserDto response = new UserDto();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = userRepository.findByUsername(refreshTokenRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + refreshTokenRequest.getUsername()));


            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @Override
    public void deleteUser(Long userId) throws UserNotFoundException {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
    }

    @Override
    public UserDto updateUser(Long userId, UserDto updateUserDto) throws UserNotFoundException {
        UserDto userDto = new UserDto();

        // Tìm người dùng theo ID
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Kiểm tra xem username hoặc email có bị trùng lặp không, ngoại trừ thông tin hiện tại
            boolean usernameChanged = !user.getUsername().trim().equals(updateUserDto.getUsername().trim());
            boolean emailChanged = !user.getEmail().trim().equals(updateUserDto.getEmail().trim());

            // Kiểm tra username
            if (usernameChanged && userRepository.existsByUsername(updateUserDto.getUsername())) {
                userDto.setStatusCode(400);
                userDto.setMessage("Username đã được sử dụng!");
                return userDto;
            }

            // Kiểm tra email
            if (emailChanged && userRepository.existsByEmail(updateUserDto.getEmail())) {
                userDto.setStatusCode(400);
                userDto.setMessage("Email đã được sử dụng!");
                return userDto;
            }

            // Cập nhật thông tin người dùng
            user.setUsername(updateUserDto.getUsername());
            user.setEmail(updateUserDto.getEmail());
            if (updateUserDto.getPassword() != null && !updateUserDto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateUserDto.getPassword()));
            }
            user.setRoles(Arrays.asList(roleRepository.findByName(updateUserDto.getRole())));

            // Lưu người dùng đã cập nhật
            User userResult = userRepository.save(user);
            if (userResult.getId() != null) {
                userDto.setOurUsers(userResult); // Gán người dùng đã cập nhật vào ourUsers
                userDto.setMessage("User updated successfully");
                userDto.setStatusCode(200);
            }
        } else {
            // Xử lý trường hợp không tìm thấy người dùng
            throw new UserNotFoundException("Không tìm thấy người dùng với id: " + userId);
        }

        return userDto;
    }

    @Override
    public void updateRole(Long id, String role) throws UserNotFoundException {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Tìm Role từ roleRepository
            Role roleEntity = roleRepository.findByName(role);
            if (roleEntity != null) {
                user.setRoles(Arrays.asList(roleEntity));
                userRepository.save(user); // Lưu thay đổi
            } else {
                throw new IllegalArgumentException("Không tìm thấy vai trò với tên: " + role);
            }
        } else {
            throw new UserNotFoundException("Không tìm thấy người dùng với id: " + id);
        }
    }


    @Override
    public Optional<UserDto> getUserById(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            UserDto userDto = mapToUserDto(user);
            userDto.setStatusCode(200);
            return Optional.of(userDto);
        } else {
            return Optional.empty();
        }
    }

    private UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        String roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(", "));
        userDto.setRole(roles);
        return userDto;
    }
    @Override
    public List<UserDto> allUser() {
        List<UserDto> userDtos = new ArrayList<>();

        List<User> users = userRepository.findAll(); // Lấy danh sách tất cả người dùng

        for(User user : users){
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setUsername(user.getUsername());
            userDto.setEmail(user.getEmail());
            userDto.setCreatedAt(user.getCreatedAt());
            userDto.setUpdatedAt(user.getUpdatedAt());
            String roles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.joining(", "));
            userDto.setRole(roles);

            userDto.setCustomerId(user.getCustomer().getId());
            userDtos.add(userDto);
        }
        return userDtos;
    }

    public Long getCountUsersToday() {
        return userRepository.countUsersToday();
    }

    public Long getCountUsersThisMonth() {
        return userRepository.countUsersThisMonth();
    }

    public Long getCountUsersThisYear() {
        return userRepository.countUsersThisYear();
    }

    public Long getCountUsersAllTime() {
        return userRepository.countUsersAllTime();
    }
}
