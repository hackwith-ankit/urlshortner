package com.smarturl.controller;

import com.smarturl.dto.UpdateProfileRequest;
import com.smarturl.entity.User;
import com.smarturl.dto.AuthResponse;
import com.smarturl.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Profile", description = "User profile management")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<AuthResponse.UserDto> getProfile(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<AuthResponse.UserDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request, Authentication auth) {
        User user = authService.updateProfile(auth.getName(), request);
        return ResponseEntity.ok(AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build());
    }
}
