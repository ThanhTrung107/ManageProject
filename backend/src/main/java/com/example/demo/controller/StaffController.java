package com.example.demo.controller;

import com.example.demo.dto.request.StaffCreationRequest;
import com.example.demo.dto.request.StaffUpdateRequest;
import com.example.demo.entity.Staff;
import com.example.demo.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staffs")
public class StaffController {
  @Autowired
  private StaffService staffService;

  @PostMapping
  public Staff createStaff(@RequestBody @Valid StaffCreationRequest request) {
    return staffService.createStaff(request);
  }

  @GetMapping
  List<Staff> getStaffs(@RequestParam(defaultValue = "id") String sortBy,
                        @RequestParam(defaultValue = "asc") String sortDir) {
    return staffService.getStaffsWithPriority(sortBy, sortDir);
  }

  @GetMapping("/{id}")
  public Staff getStaffbyID(@PathVariable long id) {
    return staffService.getStaffbyID(id);
  }

  @PutMapping("/{id}")
  public Staff updateStaff(@PathVariable long id, @RequestBody @Valid StaffUpdateRequest request) {
    return staffService.updateStaff(id, request);
  }

  @DeleteMapping("/{id}")
  public void deleteStaff(@PathVariable long id) {
    staffService.deleteStaff(id);
  }
}

