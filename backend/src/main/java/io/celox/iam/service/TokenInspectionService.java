package io.celox.iam.service;

import io.celox.iam.dto.PermissionsResponse;
import io.celox.iam.dto.TokenInspectResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TokenInspectionService {

    @SuppressWarnings("unchecked")
    public TokenInspectResponse inspectToken(JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();

        List<String> realmRoles = extractRoles(jwt, "realm_access");
        List<String> clientRoles = extractClientRoles(jwt, "iam-backend");

        Map<String, Object> header = new HashMap<>(jwt.getHeaders());
        Map<String, Object> claims = new HashMap<>(jwt.getClaims());

        Instant expiresAt = jwt.getExpiresAt();
        long expiresInSeconds = expiresAt != null
                ? Math.max(0, expiresAt.getEpochSecond() - Instant.now().getEpochSecond())
                : 0;

        return new TokenInspectResponse(
                jwt.getSubject(),
                jwt.getClaimAsString("preferred_username"),
                jwt.getClaimAsString("email"),
                jwt.getClaimAsString("name"),
                realmRoles,
                clientRoles,
                header,
                claims,
                jwt.getIssuedAt() != null ? jwt.getIssuedAt().toString() : null,
                expiresAt != null ? expiresAt.toString() : null,
                expiresInSeconds
        );
    }

    public PermissionsResponse getPermissions(JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();

        List<String> realmRoles = extractRoles(jwt, "realm_access");
        List<String> clientRoles = extractClientRoles(jwt, "iam-backend");
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Map<String, Boolean> permissionMatrix = buildPermissionMatrix(authorities);

        return new PermissionsResponse(
                authentication.getName(),
                realmRoles,
                clientRoles,
                authorities,
                permissionMatrix
        );
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRoles(Jwt jwt, String claimName) {
        Map<String, Object> access = jwt.getClaim(claimName);
        if (access == null) return Collections.emptyList();
        List<String> roles = (List<String>) access.get("roles");
        return roles != null ? roles : Collections.emptyList();
    }

    @SuppressWarnings("unchecked")
    private List<String> extractClientRoles(Jwt jwt, String clientId) {
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess == null) return Collections.emptyList();
        Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get(clientId);
        if (clientAccess == null) return Collections.emptyList();
        List<String> roles = (List<String>) clientAccess.get("roles");
        return roles != null ? roles : Collections.emptyList();
    }

    private Map<String, Boolean> buildPermissionMatrix(List<String> authorities) {
        Map<String, Boolean> matrix = new LinkedHashMap<>();
        matrix.put("GET /api/v1/public/**", true);
        matrix.put("GET /api/v1/token/inspect", authorities.stream().anyMatch(a -> !a.equals("ROLE_viewer") || authorities.size() > 1));
        matrix.put("GET /api/v1/token/permissions", authorities.stream().anyMatch(a -> !a.equals("ROLE_viewer") || authorities.size() > 1));
        matrix.put("GET /api/v1/users", authorities.contains("ROLE_api-read"));
        matrix.put("GET /api/v1/users/{id}", authorities.contains("ROLE_api-read"));
        matrix.put("POST /api/v1/users", authorities.contains("ROLE_api-write"));
        matrix.put("PUT /api/v1/users/{id}", authorities.contains("ROLE_api-write"));
        matrix.put("DELETE /api/v1/users/{id}", authorities.contains("ROLE_api-admin"));
        matrix.put("GET /api/v1/roles", authorities.contains("ROLE_api-read"));
        matrix.put("GET /api/v1/admin/dashboard", authorities.contains("ROLE_admin"));
        matrix.put("GET /api/v1/admin/audit-log", authorities.contains("ROLE_admin"));
        return matrix;
    }
}
