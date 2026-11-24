
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.ParentStudentLink;
import com.vidyasetu.backend.repository.ParentStudentLinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParentStudentLinkService {

    private final ParentStudentLinkRepository linkRepository;

    public ParentStudentLinkService(
            ParentStudentLinkRepository linkRepository) {
        this.linkRepository = linkRepository;
    }

    public ParentStudentLink linkStudentToParent(
            Long parentUserId,
            Long studentId) {

        if (linkRepository
                .findByParentUserIdAndStudentId(
                        parentUserId, studentId)
                .isPresent()) {
            throw new RuntimeException(
                    "This student is already linked to this parent"
            );
        }

        ParentStudentLink link = new ParentStudentLink();
        link.setParentUserId(parentUserId);
        link.setStudentId(studentId);

        return linkRepository.save(link);
    }

    public List<ParentStudentLink> getChildren(Long parentUserId) {
        return linkRepository.findByParentUserId(parentUserId);
    }

    public boolean isParentLinkedToStudent(
            Long parentUserId,
            Long studentId) {

        return linkRepository
                .findByParentUserIdAndStudentId(
                        parentUserId, studentId)
                .isPresent();
    }
}
