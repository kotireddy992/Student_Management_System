package org.example.studentmanagement.repository;
import org.example.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface StudentRepository extends JpaRepository<Student,Long>{
    List<Student> findByCity(String city);
}