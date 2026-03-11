package com.example.demo.controller;

import com.example.demo.dto.request.LoginRequest;

import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.request.response.LoginResponse;
import com.example.demo.entity.Account;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final JwtUtil jwtUtil;
  private final AccountService accountService;

  public AuthController(JwtUtil jwtUtil, AccountService accountService) {
    this.jwtUtil = jwtUtil;
    this.accountService = accountService;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
    Optional<Account> accountOpt = accountService.authenticate(
      request.getUsername(),
      request.getPassword()
    );

    if (accountOpt.isPresent()) {
      Account account = accountOpt.get();
      String token = jwtUtil.generateToken(
        account.getUsername(),
        account.getRole()
      );

      LoginResponse response = new LoginResponse(
        token,
        account.getRole(),
        account.getUsername()
      );

      return ResponseEntity.ok(response);
    }

    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(Map.of("error", "Tài khoản hoặc mật khẩu không đúng"));
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
    // Kiểm tra username đã tồn tại chưa
    if (accountService.existsByUsername(request.getUsername())) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", "Username đã tồn tại"));
    }

    // Kiểm tra password và confirmPassword có khớp không
    if (!request.getPassword().equals(request.getConfirmPassword())) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", "Mật khẩu xác nhận không khớp"));
    }

    // Đăng ký tài khoản mới
    Account newAccount = accountService.register(request);

    return ResponseEntity
      .status(HttpStatus.CREATED)
      .body(Map.of(
        "message", "Đăng ký thành công",
        "username", newAccount.getUsername()
      ));
  }
  @GetMapping("/validate")
  public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      if (jwtUtil.isTokenValid(token)) {
        return ResponseEntity.ok(Map.of(
          "valid", true,
          "username", jwtUtil.extractUsername(token),
          "role", jwtUtil.extractRole(token)
        ));
      }
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
  }
}
