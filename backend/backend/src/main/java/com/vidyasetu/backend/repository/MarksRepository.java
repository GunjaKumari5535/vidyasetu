package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentIdOrderByExamDateDescIdDesc(Long studentId);

    List<Marks> findByStudentId(Long studentId);

}