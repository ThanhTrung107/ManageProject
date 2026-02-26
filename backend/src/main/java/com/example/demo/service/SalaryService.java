package com.example.demo.service;

import com.example.demo.dto.request.SalaryCreationRequest;
import com.example.demo.dto.request.SalaryUpdateRequest;
import com.example.demo.entity.Salary;
import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffException;
import com.example.demo.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryService {
  @Autowired
  private SalaryRepository salaryRepository;
  @Autowired
  private StaffService staffService;

  public List<Salary> getSalariesByStaffId(long staffId) {
    return salaryRepository.findByStaffId(staffId);
  }

  public Salary createSalary(long staffId, SalaryCreationRequest request) {

    if (salaryRepository.existsByStaffIdAndMonth(staffId, request.getMonth())) {
      throw new StaffException("month", "Nhân viên này đã có bảng lương cho tháng " + request.getMonth());
    }

    Staff staff = staffService.getStaffbyID(staffId);
    Salary salary = new Salary();
    salary.setStaff(staff);
    salary.setBasicSalary(request.getBasicSalary());
    salary.setBonus(request.getBonus());
    salary.setMonth(request.getMonth());

    return salaryRepository.save(salary);
  }

  public Salary updateSalary(long salaryId, SalaryUpdateRequest request) {
    Salary salary = salaryRepository.findById(salaryId)
      .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi lương với ID: " + salaryId));

    long staffId = salary.getStaff().getId();
    if (salaryRepository.existsByStaffIdAndMonthAndIdNot(staffId, request.getMonth(), salaryId)) {
      throw new StaffException("month", "Tháng " + request.getMonth() + " đã tồn tại bảng lương khác cho nhân viên này.");
    }

    salary.setBasicSalary(request.getBasicSalary());
    salary.setBonus(request.getBonus());
    salary.setMonth(request.getMonth());
    return salaryRepository.save(salary);
  }

  public void deleteSalary(long salaryId) {
    salaryRepository.deleteById(salaryId);
  }
}
