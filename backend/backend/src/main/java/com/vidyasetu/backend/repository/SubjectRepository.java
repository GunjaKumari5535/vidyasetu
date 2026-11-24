
package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsByNameIgnoreCase(String name);
}
