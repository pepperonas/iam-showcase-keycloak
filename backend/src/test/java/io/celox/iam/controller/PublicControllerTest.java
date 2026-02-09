package io.celox.iam.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PublicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointShouldReturnUp() throws Exception {
        mockMvc.perform(get("/api/v1/public/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    void infoEndpointShouldReturnAppInfo() throws Exception {
        mockMvc.perform(get("/api/v1/public/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("IAM Showcase"))
                .andExpect(jsonPath("$.version").isNotEmpty())
                .andExpect(jsonPath("$.copyright").value("(c) 2026 Martin Pfeffer | celox.io"));
    }

    @Test
    void publicEndpointsShouldNotRequireAuth() throws Exception {
        mockMvc.perform(get("/api/v1/public/health"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/public/info"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpointShouldReturn401WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/v1/token/inspect"))
                .andExpect(status().isUnauthorized());
    }
}
