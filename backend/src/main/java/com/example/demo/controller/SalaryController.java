package com.example.demo.controller;


import com.example.demo.dto.request.SalaryCreationRequest;
import com.example.demo.dto.request.SalaryUpdateRequest;
import com.example.demo.entity.Salary;
import com.example.demo.service.SalaryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salaries")
public class SalaryController {

  @Autowired
  private SalaryService salaryService;

  @GetMapping("/{staffId}")
  public List<Salary> getSalariesByStaff(@PathVariable long staffId) {
    return salaryService.getSalariesByStaffId(staffId);
  }

  @PostMapping("/{staffId}")
  public Salary createSalary(@PathVariable long staffId, @RequestBody @Valid SalaryCreationRequest request) {
    return salaryService.createSalary(staffId, request);
  }

  @PutMapping("/{salaryId}")
  public Salary updateSalary(@PathVariable long salaryId, @RequestBody @Valid SalaryUpdateRequest request) {
    return salaryService.updateSalary(salaryId, request);
  }

  @DeleteMapping("/{salaryId}")
  public void deleteSalary(@PathVariable long salaryId) {
    salaryService.deleteSalary(salaryId);
  }
}
