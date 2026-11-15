package com.example.taskmanagement.dto;

import com.example.taskmanagement.entity.Task;
import java.time.LocalDate;

public record TaskUpdateRequest(
        Task.Priority priority,
        LocalDate dueDate) {
}
