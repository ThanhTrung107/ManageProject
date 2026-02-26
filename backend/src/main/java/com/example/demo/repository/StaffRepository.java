package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
//  @Query(value = "SELECT * FROM Staff ORDER BY STATUS DESC, ID ASC ", nativeQuery = true )
//  List<Staff> getAllStaffs();

  boolean existsByEmail(String email);

  boolean existsByPhone(String phone);

  boolean existsByCitizenId(String citizenId);

  @Query(value = "SELECT * FROM STAFF WHERE ID = :id", nativeQuery = true)
  Staff getStaff(@PathVariable long id);
}
