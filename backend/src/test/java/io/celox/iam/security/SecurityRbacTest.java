package io.celox.iam.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityRbacTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicEndpointsShouldBeAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/v1/public/health")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/public/info")).andExpect(status().isOk());
    }

    @Test
    void samlMetadataShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/v1/saml/metadata")).andExpect(status().isOk());
    }

    @Test
    void tokenInspectShouldRequireAuth() throws Exception {
        mockMvc.perform(get("/api/v1/token/inspect")).andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInspectShouldWorkWithValidJwt() throws Exception {
        mockMvc.perform(get("/api/v1/token/inspect")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "user@demo.celox.io")
                        .claim("realm_access", Map.of("roles", List.of("user"))))))
                .andExpect(status().isOk());
    }

    @Test
    void adminDashboardShouldRequireAdminRole() throws Exception {
        // Ohne admin-Rolle -> 403
        mockMvc.perform(get("/api/v1/admin/dashboard")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "user@demo.celox.io")
                        .claim("realm_access", Map.of("roles", List.of("user"))))))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminDashboardShouldAllowAdminRole() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard")
                .with(adminJwt()))
                .andExpect(status().isOk());
    }

    @Test
    void viewerCannotPostUsers() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "viewer@demo.celox.io")
                        .claim("realm_access", Map.of("roles", List.of("viewer")))))
                .contentType("application/json")
                .content("{\"username\":\"test\",\"email\":\"t@t.de\",\"password\":\"Test1234\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void viewerCannotDeleteUsers() throws Exception {
        mockMvc.perform(delete("/api/v1/users/some-id")
                .with(jwt().jwt(builder -> builder
                        .claim("preferred_username", "viewer@demo.celox.io")
                        .claim("realm_access", Map.of("roles", List.of("viewer"))))))
                .andExpect(status().isForbidden());
    }

    private SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor adminJwt() {
        return jwt().jwt(builder -> builder
                .claim("preferred_username", "admin@demo.celox.io")
                .claim("realm_access", Map.of("roles", List.of("admin")))
                .claim("resource_access", Map.of("iam-backend", Map.of("roles", List.of("api-admin", "api-write", "api-read")))));
    }
}
