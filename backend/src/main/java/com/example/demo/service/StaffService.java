package com.example.demo.service;

import com.example.demo.dto.request.SalaryCreationRequest;
import com.example.demo.dto.request.StaffCreationRequest;
import com.example.demo.dto.request.StaffUpdateRequest;
import com.example.demo.entity.Salary;
import com.example.demo.entity.Staff;
import com.example.demo.exception.StaffException;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class StaffService {

  @Autowired
  private StaffRepository staffRepository;

  public Staff createStaff(StaffCreationRequest request) {
    if (staffRepository.existsByEmail(request.getEmail())) {
      throw new StaffException("email", "Email này đã tồn tại trong hệ thống");
    }

    // Check trùng Phone -> Báo lỗi vào field 'phone'
    if (staffRepository.existsByPhone(request.getPhone())) {
      throw new StaffException("phone", "Số điện thoại này đã được sử dụng");
    }

    // Check trùng CCCD -> Báo lỗi vào field 'citizen_id'
    if (staffRepository.existsByCitizenId(request.getCitizenId())) {
      throw new StaffException("citizenId", "Số CCCD này đã tồn tại");
    }
    if (request.getSalaries() != null && !request.getSalaries().isEmpty()) {
      long uniqueMonthsCount = request.getSalaries().stream()
        .map(SalaryCreationRequest::getMonth) // Lấy ra danh sách các tháng
        .distinct() // Chỉ giữ lại các tháng khác nhau
        .count(); // Đếm số lượng

      if (uniqueMonthsCount < request.getSalaries().size()) {
        throw new StaffException("month", "Danh sách lương kèm theo có các tháng bị trùng lặp!");
      }
    }
    Staff staff = new Staff();

    staff.setFullname(request.getFullname());
    staff.setEmail(request.getEmail());
    staff.setPhone(request.getPhone());
    staff.setCitizenId(request.getCitizenId());
    staff.setBirthday(request.getBirthday());
    staff.setGender(request.getGender());
    staff.setAddress(request.getAddress());
    staff.setStatus(request.getStatus());
    staff.setPosition_id(request.getPosition_id());
    staff.setDepartment_id(request.getDepartment_id().toUpperCase(Locale.ROOT));
    staff.setJoin_date(request.getJoin_date());
    if (request.getSalaries() != null) {
      List<Salary> salaries = request.getSalaries().stream().map(sReq -> {
        Salary s = new Salary();
        s.setBasicSalary(sReq.getBasicSalary());
        s.setBonus(sReq.getBonus());
        s.setMonth(sReq.getMonth());
        s.setStaff(staff); // Liên kết bản ghi lương với nhân viên mới
        return s;
      }).toList();
      staff.setSalaries(salaries);
    }
    return staffRepository.save(staff);
  }

  public Staff updateStaff(long id, StaffUpdateRequest request) {
    Staff staff = getStaffbyID(id);

    staff.setFullname(request.getFullname());
    staff.setEmail(request.getEmail());
    staff.setPhone(request.getPhone());
    staff.setCitizenId(request.getCitizenId());
    staff.setBirthday(request.getBirthday());
    staff.setGender(request.getGender());
    staff.setAddress(request.getAddress());
    staff.setStatus(request.getStatus());
    staff.setPosition_id(request.getPosition_id());
    staff.setDepartment_id(request.getDepartment_id().toUpperCase(Locale.ROOT));

    return staffRepository.save(staff);
  }

  public Staff getStaffbyID(long id) {
    return staffRepository.getStaff(id);
  }

  public void deleteStaff(long id) {
    staffRepository.deleteById(id);
  }

  public List<Staff> getStaffsWithPriority(String userSortField, String sortDir) {

    Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort userSort = Sort.by(direction, userSortField);

    Sort statusSort = Sort.by(Sort.Direction.DESC, "status");

    // Tương đương SQL: ORDER BY status DESC, [userSortField] [ASC/DESC]
    Sort finalSort = statusSort.and(userSort);

    return staffRepository.findAll(finalSort);
  }
}
