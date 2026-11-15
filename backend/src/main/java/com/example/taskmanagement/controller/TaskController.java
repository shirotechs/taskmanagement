package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.TaskCreateRequest;
import com.example.taskmanagement.dto.TaskMoveRequest;
import com.example.taskmanagement.dto.TaskResponse;
import com.example.taskmanagement.dto.TaskUpdateRequest;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/api/tasks")
    public List<TaskResponse> search(
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) Task.Priority priority,
            @RequestParam(required = false) String keyword) {
        return taskService.search(status, priority, keyword);
    }

    @PostMapping("/api/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskCreateRequest request) {
        return taskService.create(request);
    }

    // 優先度・期限日の更新(nullは「未設定」に戻す)
    @PatchMapping("/api/tasks/{id}")
    public TaskResponse update(@PathVariable Long id, @RequestBody TaskUpdateRequest request) {
        return taskService.update(id, request);
    }

    // ドラッグ&ドロップによる列移動・並び替え
    @PutMapping("/api/tasks/{id}/move")
    public TaskResponse move(@PathVariable Long id, @Valid @RequestBody TaskMoveRequest request) {
        return taskService.move(id, request);
    }
}
