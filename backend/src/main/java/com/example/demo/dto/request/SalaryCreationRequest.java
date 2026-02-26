package com.example.demo.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SalaryCreationRequest {
  @NotNull(message = "Lương cơ bản không được để trống")
  @Min(value = 0, message = "Lương cơ bản không được âm")
  private long basicSalary;
  @Min(value = 0, message = "Lương cơ bản không được âm")
  private long bonus;
  @NotNull(message = "Tháng lương không được để trống")
  @Min(value = 1, message = "Tháng lương phải đúng định dạng")
  @Max(value = 12, message = "Tháng lương phải đúng định dạng")
  private int month;

  public long getBasicSalary() {
    return basicSalary;
  }

  public void setBasicSalary(long basicSalary) {
    this.basicSalary = basicSalary;
  }

  public long getBonus() {
    return bonus;
  }

  public void setBonus(long bonus) {
    this.bonus = bonus;
  }

  public int getMonth() {
    return month;
  }

  public void setMonth(int month) {
    this.month = month;
  }
}
