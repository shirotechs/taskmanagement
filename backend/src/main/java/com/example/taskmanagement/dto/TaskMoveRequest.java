package com.example.taskmanagement.dto;

import com.example.taskmanagement.entity.Task;
import jakarta.validation.constraints.NotNull;

public record TaskMoveRequest(
        @NotNull Task.Status status,
        Long beforeId) {
}
