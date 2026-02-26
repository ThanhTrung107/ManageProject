package com.example.demo.repository;

import com.example.demo.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
  List<Salary> findByStaffId(long staffId);

  // Kiểm tra xem nhân viên đã có lương tháng này chưa (Dùng cho Add)
  boolean existsByStaffIdAndMonth(long staffId, int month);

  // Kiểm tra xem nhân viên đã có lương tháng này chưa, ngoại trừ chính bản ghi đang sửa (Dùng cho Edit)
  boolean existsByStaffIdAndMonthAndIdNot(long staffId, int month, long salaryId);
}
