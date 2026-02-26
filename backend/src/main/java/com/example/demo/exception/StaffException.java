package com.example.demo.exception;

public class StaffException extends RuntimeException {
  private String field;

  public StaffException(String field, String message) {
    super(message);
    this.field = field;
  }

  public String getField() {
    return field;
  }
}
