package com.example.taskmanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.taskmanagement.repository.TaskRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TaskApiTest {

    @Autowired
    MockMvc mvc;
    @Autowired
    TaskRepository repository;
    @Autowired
    ObjectMapper mapper;

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    private long create(String title, String status) throws Exception {
        String body = mapper.writeValueAsString(
                java.util.Map.of("title", title, "status", status));
        String res = mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(res).get("id").asLong();
    }

    private void move(long id, String status, Long beforeId, int expected) throws Exception {
        String body = beforeId == null
                ? "{\"status\":\"" + status + "\"}"
                : "{\"status\":\"" + status + "\",\"beforeId\":" + beforeId + "}";
        mvc.perform(put("/api/tasks/" + id + "/move").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().is(expected));
    }

    @Test
    void 空タイトルは400でメッセージが返る() throws Exception {
        mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content("{\"title\":\" \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void 存在しないIDは404() throws Exception {
        mvc.perform(delete("/api/tasks/999")).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void どの列のタスクも削除できる() throws Exception {
        long a = create("A", "TODO");
        long b = create("B", "IN_PROGRESS");
        mvc.perform(delete("/api/tasks/" + a)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/tasks/" + b)).andExpect(status().isNoContent());
        mvc.perform(get("/api/tasks")).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void 列内で並び替えできる() throws Exception {
        long a = create("A", "TODO");
        long b = create("B", "TODO");
        long c = create("C", "TODO");
        move(c, "TODO", a, 200);
        String res = mvc.perform(get("/api/tasks?status=TODO")).andReturn().getResponse().getContentAsString();
        JsonNode list = mapper.readTree(res);
        org.junit.jupiter.api.Assertions.assertEquals(c, list.get(0).get("id").asLong());
        org.junit.jupiter.api.Assertions.assertEquals(a, list.get(1).get("id").asLong());
        org.junit.jupiter.api.Assertions.assertEquals(b, list.get(2).get("id").asLong());
    }

    @Test
    void 別の列へ移動できる() throws Exception {
        long a = create("A", "TODO");
        move(a, "DONE", null, 200);
        mvc.perform(get("/api/tasks?status=DONE")).andExpect(jsonPath("$[0].id").value(a));
    }

    @Test
    void 移動先に無いbeforeIdは400() throws Exception {
        long a = create("A", "TODO");
        long d = create("D", "DONE");
        move(a, "TODO", d, 400);
        move(a, "DONE", 12345L, 400);
    }

    @Test
    void キーワードのワイルドカードはリテラル扱い() throws Exception {
        create("100% done", "TODO");
        create("other", "TODO");
        mvc.perform(get("/api/tasks").param("keyword", "%"))
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void 説明が長すぎると400() throws Exception {
        String body = mapper.writeValueAsString(
                java.util.Map.of("title", "t", "description", "x".repeat(10001)));
        mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }
}
