
package com.vidyasetu.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "parent_student_links",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"parent_user_id", "student_id"}
        )
    }
)
public class ParentStudentLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_user_id", nullable = false)
    private Long parentUserId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    public ParentStudentLink() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(Long parentUserId) {
        this.parentUserId = parentUserId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}
