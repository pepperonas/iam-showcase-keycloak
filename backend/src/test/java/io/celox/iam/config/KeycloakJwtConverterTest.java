package io.celox.iam.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class KeycloakJwtConverterTest {

    private KeycloakJwtConverter converter;

    @BeforeEach
    void setUp() {
        converter = new KeycloakJwtConverter();
    }

    @Test
    void shouldExtractRealmRoles() {
        Jwt jwt = buildJwt(
                Map.of("realm_access", Map.of("roles", List.of("admin", "user"))),
                null
        );

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertNotNull(token);
        Collection<GrantedAuthority> authorities = token.getAuthorities();
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin")));
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_user")));
    }

    @Test
    void shouldExtractClientRoles() {
        Jwt jwt = buildJwt(
                null,
                Map.of("iam-backend", Map.of("roles", List.of("api-read", "api-write")))
        );

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertNotNull(token);
        Collection<GrantedAuthority> authorities = token.getAuthorities();
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_api-read")));
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_api-write")));
    }

    @Test
    void shouldCombineRealmAndClientRoles() {
        Jwt jwt = buildJwt(
                Map.of("realm_access", Map.of("roles", List.of("admin"))),
                Map.of("iam-backend", Map.of("roles", List.of("api-admin")))
        );

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertNotNull(token);
        assertEquals(2, token.getAuthorities().size());
    }

    @Test
    void shouldHandleMissingRealmAccess() {
        Jwt jwt = buildJwt(null, null);

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertNotNull(token);
        assertTrue(token.getAuthorities().isEmpty());
    }

    @Test
    void shouldUsePreferredUsernameAsPrincipal() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "user-id-123")
                .claim("preferred_username", "admin@demo.celox.io")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(300))
                .build();

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertEquals("admin@demo.celox.io", token.getName());
    }

    @Test
    void shouldFallbackToSubjectWhenNoPreferredUsername() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "user-id-123")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(300))
                .build();

        AbstractAuthenticationToken token = converter.convert(jwt);

        assertEquals("user-id-123", token.getName());
    }

    private Jwt buildJwt(Map<String, Object> realmAccess, Map<String, Object> resourceAccess) {
        var builder = Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("sub", "user-id-123")
                .claim("preferred_username", "testuser")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(300));

        if (realmAccess != null) {
            builder.claim("realm_access", realmAccess);
        }
        if (resourceAccess != null) {
            builder.claim("resource_access", resourceAccess);
        }

        return builder.build();
    }
}
