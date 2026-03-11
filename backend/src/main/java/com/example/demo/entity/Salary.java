package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Salary implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  @ManyToOne
  @JoinColumn(name = "STAFFID")
  @JsonIgnore
  private Staff staff;
  @Column(name = "BASICSALARY")
  private long basicSalary;
  @Column(name = "BONUS")
  private long bonus;
  @Column(name = "MONTH")
  private int month;

  public Staff getStaff() {
    return staff;
  }

  public void setStaff(Staff staff) {
    this.staff = staff;
  }

  public int getMonth() {
    return month;
  }

  public void setMonth(int month) {
    this.month = month;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

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
}
