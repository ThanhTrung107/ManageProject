package com.example.demo.dto.request;

import jakarta.validation.constraints.*;

import java.util.Date;

public class StaffUpdateRequest {
  @NotBlank(message = "Họ tên không được để trống")
  private String fullname;
  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không đúng định dạng")
  private String email;
  @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải đúng 10 chữ số")
  @NotBlank(message = "Số điện thoại không được để trống")
  private String phone;
  @NotBlank(message = "CCCD không được để trống")
  @Pattern(regexp = "^\\d{12}$", message = "CCCD không hợp lệ (Phải đúng 12 chữ số)")
  private String citizenId;
  @NotNull(message = "Ngày sinh không được để trống")
  @Past(message = "Ngày sinh không được lớn hơn ngày hiện tại")
  private Date birthday;
  @NotBlank(message = "Giới tính không được để trống")
  private String gender;
  @NotBlank(message = "Địa chỉ không được để trống")
  private String address;
  @NotBlank(message = "Trạng thái không được để trống")
  private String status;
  @NotNull(message = "Vị trí không được để trống")
  private long position_id;
  @NotBlank(message = "Phòng ban không được để trống")
  private String department_id;
  @NotNull(message = "Ngày bắt đầu làm không được để trống")
  @Past(message = "Ngày bắt đầu làm không được lớn hơn ngày hiện tại")
  private Date join_date;

  public String getFullname() {
    return fullname;
  }

  public void setFullname(String fullname) {
    this.fullname = fullname;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getCitizenId() {
    return citizenId;
  }

  public void setCitizenId(String citizenId) {
    this.citizenId = citizenId;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public long getPosition_id() {
    return position_id;
  }

  public void setPosition_id(long position_id) {
    this.position_id = position_id;
  }

  public String getDepartment_id() {
    return department_id;
  }

  public void setDepartment_id(String department_id) {
    this.department_id = department_id;
  }

  public Date getBirthday() {
    return birthday;
  }

  public void setBirthday(Date birthday) {
    this.birthday = birthday;
  }

  public Date getJoin_date() {
    return join_date;
  }

  public void setJoin_date(Date join_date) {
    this.join_date = join_date;
  }
}
