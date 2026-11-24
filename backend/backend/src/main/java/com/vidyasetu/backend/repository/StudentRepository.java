package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByVillage(String village);

}