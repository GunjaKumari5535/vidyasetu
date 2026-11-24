
package com.vidyasetu.backend.repository;

import com.vidyasetu.backend.entity.ParentStudentLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParentStudentLinkRepository
        extends JpaRepository<ParentStudentLink, Long> {

    List<ParentStudentLink> findByParentUserId(Long parentUserId);

    Optional<ParentStudentLink> findByParentUserIdAndStudentId(
            Long parentUserId,
            Long studentId
    );

    List<ParentStudentLink> findByStudentId(Long studentId);
}
