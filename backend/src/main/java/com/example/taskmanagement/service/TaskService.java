package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TaskResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> search(Task.Status status, Task.Priority priority, String keyword) {
        return taskRepository.search(status, priority, keyword).stream()
                .map(TaskResponse::from)
                .toList();
    }
}
