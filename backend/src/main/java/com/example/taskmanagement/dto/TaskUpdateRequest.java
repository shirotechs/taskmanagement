package com.example.taskmanagement.dto;

import com.example.taskmanagement.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskUpdateRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        Task.Priority priority,
        LocalDate dueDate) {
}
