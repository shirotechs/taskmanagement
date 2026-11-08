package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TaskCreateRequest;
import com.example.taskmanagement.dto.TaskResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import java.time.LocalDateTime;
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

    public TaskResponse create(TaskCreateRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status() != null ? request.status() : Task.Status.TODO);
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        return TaskResponse.from(taskRepository.save(task));
    }
}
