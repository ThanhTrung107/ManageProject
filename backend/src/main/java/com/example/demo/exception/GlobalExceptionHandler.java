package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  // Hứng lỗi Logic (Trùng email, trùng SĐT...) do bạn tự ném ra từ Service
  @ExceptionHandler(StaffException.class)
  public ResponseEntity<Map<String, String>> handleAppException(StaffException ex) {
    Map<String, String> error = new HashMap<>();
    error.put(ex.getField(), ex.getMessage());
    return ResponseEntity.badRequest().body(error);
  }

  // Hứng lỗi Validate (@Valid, @NotBlank, @Pattern...) từ DTO
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((org.springframework.validation.FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return ResponseEntity.badRequest().body(errors);
  }
}
