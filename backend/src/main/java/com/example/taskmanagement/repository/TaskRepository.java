package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
        SELECT t FROM Task t
        WHERE (:status IS NULL OR t.status = :status)
          AND (:priority IS NULL OR t.priority = :priority)
          AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY t.id
        """)
    List<Task> search(
            @Param("status") Task.Status status,
            @Param("priority") Task.Priority priority,
            @Param("keyword") String keyword);
}
