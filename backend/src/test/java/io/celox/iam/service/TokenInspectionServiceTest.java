package io.celox.iam.service;

import io.celox.iam.dto.PermissionsResponse;
import io.celox.iam.dto.TokenInspectResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TokenInspectionServiceTest {

    private TokenInspectionService service;

    @BeforeEach
    void setUp() {
        service = new TokenInspectionService();
    }

    @Test
    void shouldInspectTokenWithAllClaims() {
        Jwt jwt = buildAdminJwt();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt,
                List.of(new SimpleGrantedAuthority("ROLE_admin"),
                        new SimpleGrantedAuthority("ROLE_api-admin")),
                "admin@demo.celox.io");

        TokenInspectResponse response = service.inspectToken(auth);

        assertEquals("admin@demo.celox.io", response.preferredUsername());
        assertEquals("admin@demo.celox.io", response.email());
        assertFalse(response.realmRoles().isEmpty());
        assertTrue(response.realmRoles().contains("admin"));
        assertTrue(response.expiresInSeconds() > 0);
    }

    @Test
    void shouldReturnPermissionMatrix() {
        Jwt jwt = buildAdminJwt();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt,
                List.of(new SimpleGrantedAuthority("ROLE_admin"),
                        new SimpleGrantedAuthority("ROLE_api-admin"),
                        new SimpleGrantedAuthority("ROLE_api-read")),
                "admin@demo.celox.io");

        PermissionsResponse response = service.getPermissions(auth);

        assertNotNull(response.permissionMatrix());
        assertTrue(response.permissionMatrix().get("GET /api/v1/admin/dashboard"));
        assertTrue(response.permissionMatrix().get("DELETE /api/v1/users/{id}"));
        assertTrue(response.permissionMatrix().get("GET /api/v1/users"));
    }

    @Test
    void shouldDenyAdminEndpointsForViewer() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "viewer-id")
                .claim("preferred_username", "viewer@demo.celox.io")
                .claim("realm_access", Map.of("roles", List.of("viewer")))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(300))
                .build();

        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt,
                List.of(new SimpleGrantedAuthority("ROLE_viewer")),
                "viewer@demo.celox.io");

        PermissionsResponse response = service.getPermissions(auth);

        assertFalse(response.permissionMatrix().get("GET /api/v1/admin/dashboard"));
        assertFalse(response.permissionMatrix().get("DELETE /api/v1/users/{id}"));
        assertFalse(response.permissionMatrix().get("GET /api/v1/users"));
    }

    private Jwt buildAdminJwt() {
        return Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "admin-id")
                .claim("preferred_username", "admin@demo.celox.io")
                .claim("email", "admin@demo.celox.io")
                .claim("name", "Admin Demo")
                .claim("realm_access", Map.of("roles", List.of("admin")))
                .claim("resource_access", Map.of("iam-backend", Map.of("roles", List.of("api-admin", "api-write", "api-read"))))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(300))
                .build();
    }
}
