package io.celox.iam.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TokenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnTokenInspection() throws Exception {
        mockMvc.perform(get("/api/v1/token/inspect")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "admin@demo.celox.io")
                        .claim("email", "admin@demo.celox.io")
                        .claim("name", "Admin Demo")
                        .claim("realm_access", Map.of("roles", List.of("admin")))
                        .claim("resource_access", Map.of("iam-backend", Map.of("roles", List.of("api-admin")))))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferredUsername").value("admin@demo.celox.io"))
                .andExpect(jsonPath("$.realmRoles[0]").value("admin"))
                .andExpect(jsonPath("$.clientRoles[0]").value("api-admin"));
    }

    @Test
    void shouldReturnPermissions() throws Exception {
        mockMvc.perform(get("/api/v1/token/permissions")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "user@demo.celox.io")
                        .claim("realm_access", Map.of("roles", List.of("user")))
                        .claim("resource_access", Map.of("iam-backend", Map.of("roles", List.of("api-read")))))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user@demo.celox.io"))
                .andExpect(jsonPath("$.permissionMatrix").isMap());
    }
}
