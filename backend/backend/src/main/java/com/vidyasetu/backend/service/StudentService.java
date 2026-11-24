
package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Student;
import com.vidyasetu.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Create student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Read all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Update student
    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + id));

        existingStudent.setName(updatedStudent.getName());
        existingStudent.setClassName(updatedStudent.getClassName());
        existingStudent.setVillage(updatedStudent.getVillage());
        existingStudent.setParentPhone(updatedStudent.getParentPhone());

        return studentRepository.save(existingStudent);
    }

    // Delete student
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + id));

        studentRepository.delete(student);
    }
}
