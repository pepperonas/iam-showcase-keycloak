package io.celox.iam.service;

import io.celox.iam.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Service fuer die Kommunikation mit der Keycloak Admin REST API.
 * Verwaltet Benutzer und Rollen im iam-showcase Realm.
 */
@Service
public class KeycloakAdminService {

    private static final Logger LOG = LoggerFactory.getLogger(KeycloakAdminService.class);

    private final WebClient webClient;
    private final String realm;
    private final String clientId;
    private final String clientSecret;

    public KeycloakAdminService(
            @Value("${app.keycloak.admin-url}") String adminUrl,
            @Value("${app.keycloak.realm}") String realm,
            @Value("${app.keycloak.client-id}") String clientId,
            @Value("${app.keycloak.client-secret}") String clientSecret) {
        this.webClient = WebClient.builder().baseUrl(adminUrl).build();
        this.realm = realm;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private String getAdminToken() {
        Map<String, Object> response = webClient.post()
                .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        return response != null ? (String) response.get("access_token") : null;
    }

    @SuppressWarnings("unchecked")
    public PagedResponse<UserDto> getUsers(int page, int size) {
        String token = getAdminToken();
        int first = page * size;

        List<Map<String, Object>> users = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/realms/{realm}/users")
                        .queryParam("first", first)
                        .queryParam("max", size)
                        .build(realm))
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        Integer totalCount = webClient.get()
                .uri("/admin/realms/{realm}/users/count", realm)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Integer.class)
                .block();

        List<UserDto> userDtos = users != null
                ? users.stream().map(this::mapToUserDto).collect(Collectors.toList())
                : Collections.emptyList();

        int total = totalCount != null ? totalCount : 0;
        return new PagedResponse<>(userDtos, page, size, total, (int) Math.ceil((double) total / size));
    }

    @SuppressWarnings("unchecked")
    public UserDto getUserById(String userId) {
        String token = getAdminToken();

        Map<String, Object> user = webClient.get()
                .uri("/admin/realms/{realm}/users/{id}", realm, userId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        if (user == null) {
            throw new IllegalArgumentException("User nicht gefunden: " + userId);
        }

        // Rollen abrufen
        List<String> realmRoles = getRealmRolesForUser(token, userId);
        List<String> clientRoles = getClientRolesForUser(token, userId);

        return new UserDto(
                (String) user.get("id"),
                (String) user.get("username"),
                (String) user.get("email"),
                (String) user.get("firstName"),
                (String) user.get("lastName"),
                Boolean.TRUE.equals(user.get("enabled")),
                realmRoles,
                clientRoles,
                user.get("createdTimestamp") != null ? user.get("createdTimestamp").toString() : null
        );
    }

    public UserDto createUser(CreateUserDto dto) {
        String token = getAdminToken();

        Map<String, Object> userRep = new HashMap<>();
        userRep.put("username", dto.username());
        userRep.put("email", dto.email());
        userRep.put("firstName", dto.firstName());
        userRep.put("lastName", dto.lastName());
        userRep.put("enabled", true);
        userRep.put("emailVerified", true);
        userRep.put("credentials", List.of(Map.of(
                "type", "password",
                "value", dto.password(),
                "temporary", false
        )));

        webClient.post()
                .uri("/admin/realms/{realm}/users", realm)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(userRep)
                .retrieve()
                .toBodilessEntity()
                .block();

        // Neuen User ueber Username finden
        List<Map<String, Object>> users = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/realms/{realm}/users")
                        .queryParam("username", dto.username())
                        .queryParam("exact", true)
                        .build(realm))
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (users == null || users.isEmpty()) {
            throw new IllegalStateException("User konnte nicht erstellt werden");
        }

        String userId = (String) users.get(0).get("id");

        // Rollen zuweisen
        if (dto.realmRoles() != null) {
            assignRealmRoles(token, userId, dto.realmRoles());
        }
        if (dto.clientRoles() != null) {
            assignClientRoles(token, userId, dto.clientRoles());
        }

        return getUserById(userId);
    }

    public UserDto updateUser(String userId, UpdateUserDto dto) {
        String token = getAdminToken();

        Map<String, Object> userRep = new HashMap<>();
        if (dto.email() != null) userRep.put("email", dto.email());
        if (dto.firstName() != null) userRep.put("firstName", dto.firstName());
        if (dto.lastName() != null) userRep.put("lastName", dto.lastName());
        if (dto.enabled() != null) userRep.put("enabled", dto.enabled());

        if (!userRep.isEmpty()) {
            webClient.put()
                    .uri("/admin/realms/{realm}/users/{id}", realm, userId)
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userRep)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }

        if (dto.realmRoles() != null) {
            assignRealmRoles(token, userId, dto.realmRoles());
        }
        if (dto.clientRoles() != null) {
            assignClientRoles(token, userId, dto.clientRoles());
        }

        return getUserById(userId);
    }

    public void deleteUser(String userId) {
        String token = getAdminToken();

        webClient.delete()
                .uri("/admin/realms/{realm}/users/{id}", realm, userId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .toBodilessEntity()
                .block();
    }

    public List<RoleDto> getRealmRoles() {
        String token = getAdminToken();

        List<Map<String, Object>> roles = webClient.get()
                .uri("/admin/realms/{realm}/roles", realm)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (roles == null) return Collections.emptyList();

        return roles.stream()
                .filter(r -> !((String) r.get("name")).startsWith("default-roles-"))
                .filter(r -> !((String) r.get("name")).startsWith("uma_"))
                .filter(r -> !"offline_access".equals(r.get("name")))
                .map(r -> new RoleDto(
                        (String) r.get("id"),
                        (String) r.get("name"),
                        (String) r.get("description"),
                        Boolean.TRUE.equals(r.get("composite")),
                        false
                ))
                .collect(Collectors.toList());
    }

    public List<RoleDto> getClientRoles() {
        String token = getAdminToken();
        String clientUuid = getClientUuid(token);
        if (clientUuid == null) return Collections.emptyList();

        List<Map<String, Object>> roles = webClient.get()
                .uri("/admin/realms/{realm}/clients/{clientId}/roles", realm, clientUuid)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (roles == null) return Collections.emptyList();

        return roles.stream()
                .map(r -> new RoleDto(
                        (String) r.get("id"),
                        (String) r.get("name"),
                        (String) r.get("description"),
                        Boolean.TRUE.equals(r.get("composite")),
                        true
                ))
                .collect(Collectors.toList());
    }

    public List<RoleDto> getAllRoles() {
        return Stream.concat(getRealmRoles().stream(), getClientRoles().stream())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardStats() {
        String token = getAdminToken();

        Integer userCount = webClient.get()
                .uri("/admin/realms/{realm}/users/count", realm)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(Integer.class)
                .block();

        List<RoleDto> realmRoles = getRealmRoles();
        List<RoleDto> clientRoles = getClientRoles();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userCount != null ? userCount : 0);
        stats.put("totalRealmRoles", realmRoles.size());
        stats.put("totalClientRoles", clientRoles.size());
        stats.put("realm", realm);
        stats.put("realmRoles", realmRoles.stream().map(RoleDto::name).toList());
        stats.put("clientRoles", clientRoles.stream().map(RoleDto::name).toList());

        return stats;
    }

    // --- Hilfsmethoden ---

    @SuppressWarnings("unchecked")
    private List<String> getRealmRolesForUser(String token, String userId) {
        List<Map<String, Object>> roles = webClient.get()
                .uri("/admin/realms/{realm}/users/{id}/role-mappings/realm", realm, userId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (roles == null) return Collections.emptyList();
        return roles.stream()
                .map(r -> (String) r.get("name"))
                .filter(name -> !name.startsWith("default-roles-"))
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private List<String> getClientRolesForUser(String token, String userId) {
        String clientUuid = getClientUuid(token);
        if (clientUuid == null) return Collections.emptyList();

        List<Map<String, Object>> roles = webClient.get()
                .uri("/admin/realms/{realm}/users/{id}/role-mappings/clients/{clientId}", realm, userId, clientUuid)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (roles == null) return Collections.emptyList();
        return roles.stream().map(r -> (String) r.get("name")).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private String getClientUuid(String token) {
        List<Map<String, Object>> clients = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/realms/{realm}/clients")
                        .queryParam("clientId", clientId)
                        .build(realm))
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (clients == null || clients.isEmpty()) return null;
        return (String) clients.get(0).get("id");
    }

    @SuppressWarnings("unchecked")
    private void assignRealmRoles(String token, String userId, List<String> roleNames) {
        List<Map<String, Object>> allRoles = webClient.get()
                .uri("/admin/realms/{realm}/roles", realm)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (allRoles == null) return;

        List<Map<String, Object>> rolesToAssign = allRoles.stream()
                .filter(r -> roleNames.contains(r.get("name")))
                .map(r -> Map.of("id", r.get("id"), "name", r.get("name")))
                .collect(Collectors.toList());

        if (!rolesToAssign.isEmpty()) {
            webClient.post()
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/realm", realm, userId)
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(rolesToAssign)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }
    }

    @SuppressWarnings("unchecked")
    private void assignClientRoles(String token, String userId, List<String> roleNames) {
        String clientUuid = getClientUuid(token);
        if (clientUuid == null) return;

        List<Map<String, Object>> allRoles = webClient.get()
                .uri("/admin/realms/{realm}/clients/{clientId}/roles", realm, clientUuid)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (allRoles == null) return;

        List<Map<String, Object>> rolesToAssign = allRoles.stream()
                .filter(r -> roleNames.contains(r.get("name")))
                .map(r -> Map.of("id", r.get("id"), "name", r.get("name")))
                .collect(Collectors.toList());

        if (!rolesToAssign.isEmpty()) {
            webClient.post()
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/clients/{clientId}", realm, userId, clientUuid)
                    .header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(rolesToAssign)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        }
    }

    private UserDto mapToUserDto(Map<String, Object> user) {
        return new UserDto(
                (String) user.get("id"),
                (String) user.get("username"),
                (String) user.get("email"),
                (String) user.get("firstName"),
                (String) user.get("lastName"),
                Boolean.TRUE.equals(user.get("enabled")),
                Collections.emptyList(),
                Collections.emptyList(),
                user.get("createdTimestamp") != null ? user.get("createdTimestamp").toString() : null
        );
    }
}
