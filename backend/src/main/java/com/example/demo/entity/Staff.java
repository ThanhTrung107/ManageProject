package com.example.demo.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Staff {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private String fullname;
  private String email;
  private String phone;
  private String citizenId;
  private Date birthday;
  private String gender;
  private String address;
  private String status;
  private long position_id;
  private String department_id;
  private Date join_date;

  @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
  private List<Salary> salaries;

  public List<Salary> getSalaries() {
    return salaries;
  }

  public void setSalaries(List<Salary> salaries) {
    this.salaries = salaries;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

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

  public Date getBirthday() {
    return birthday;
  }

  public void setBirthday(Date birthday) {
    this.birthday = birthday;
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

  public Date getJoin_date() {
    return join_date;
  }

  public void setJoin_date(Date join_date) {
    this.join_date = join_date;
  }
}
