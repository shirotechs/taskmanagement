package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TaskCreateRequest;
import com.example.taskmanagement.dto.TaskMoveRequest;
import com.example.taskmanagement.dto.TaskResponse;
import com.example.taskmanagement.dto.TaskUpdateRequest;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.repository.TaskRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> search(Task.Status status, Task.Priority priority, String keyword) {
        return taskRepository.search(status, priority, escapeLike(keyword)).stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional
    public TaskResponse create(TaskCreateRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status() != null ? request.status() : Task.Status.TODO);
        taskRepository.findByStatusOrderBySortOrderAscIdAsc(task.getStatus());
        task.setSortOrder(taskRepository.findMaxSortOrder(task.getStatus()) + 1);
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long id, TaskUpdateRequest request) {
        Task task = find(id);
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setUpdatedAt(LocalDateTime.now());
        return TaskResponse.from(taskRepository.save(task));
    }

    // 移動先の列で beforeId のタスクの直前に挿入する(beforeId が null の場合は末尾。不正な beforeId は 400)
    @Transactional
    public TaskResponse move(Long id, TaskMoveRequest request) {
        Task task = find(id);
        List<Task> column = new ArrayList<>(
                taskRepository.findByStatusOrderBySortOrderAscIdAsc(request.status()));
        column.removeIf(t -> t.getId().equals(id));

        int index = column.size();
        if (request.beforeId() != null) {
            index = -1;
            for (int i = 0; i < column.size(); i++) {
                if (column.get(i).getId().equals(request.beforeId())) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "beforeId が移動先の列に存在しません: " + request.beforeId());
            }
        }
        column.add(index, task);

        LocalDateTime now = LocalDateTime.now();
        if (task.getStatus() != request.status()) {
            task.setStatus(request.status());
            task.setUpdatedAt(now);
        }
        for (int i = 0; i < column.size(); i++) {
            column.get(i).setSortOrder(i);
        }
        taskRepository.saveAll(column);
        return TaskResponse.from(task);
    }

    // 完了(DONE)のタスクのみ、DBから物理削除する
    @Transactional
    public void delete(Long id) {
        Task task = find(id);
        if (task.getStatus() != Task.Status.DONE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "完了していないタスクは削除できません: " + id);
        }
        taskRepository.delete(task);
    }

    // LIKE のワイルドカード(% _)とエスケープ文字(!)をリテラルとして検索する
    private static String escapeLike(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return keyword.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }

    private Task find(Long id) {
        return taskRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "タスクが見つかりません: " + id));
    }
}
