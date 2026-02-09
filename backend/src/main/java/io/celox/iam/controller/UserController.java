package io.celox.iam.controller;

import io.celox.iam.dto.*;
import io.celox.iam.service.AuditService;
import io.celox.iam.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Benutzerverwaltung ueber Keycloak Admin API")
@SecurityRequirement(name = "oauth2")
public class UserController {

    private final UserService userService;
    private final AuditService auditService;

    public UserController(UserService userService, AuditService auditService) {
        this.userService = userService;
        this.auditService = auditService;
    }

    @GetMapping
    @Operation(summary = "Benutzer auflisten", description = "Paginierte Liste aller Benutzer")
    public ResponseEntity<PagedResponse<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.getUsers(page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Benutzer abrufen", description = "Details eines einzelnen Benutzers")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @Operation(summary = "Benutzer erstellen", description = "Erstellt einen neuen Benutzer in Keycloak")
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody CreateUserDto dto,
            JwtAuthenticationToken auth,
            HttpServletRequest request) {
        UserDto created = userService.createUser(dto);
        auditService.logAction(
                auth.getToken().getSubject(), auth.getName(),
                "CREATE_USER", "/api/v1/users",
                "User erstellt: " + dto.username(),
                request.getRemoteAddr()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Benutzer aktualisieren", description = "Aktualisiert einen bestehenden Benutzer")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserDto dto,
            JwtAuthenticationToken auth,
            HttpServletRequest request) {
        UserDto updated = userService.updateUser(id, dto);
        auditService.logAction(
                auth.getToken().getSubject(), auth.getName(),
                "UPDATE_USER", "/api/v1/users/" + id,
                "User aktualisiert: " + id,
                request.getRemoteAddr()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Benutzer loeschen", description = "Loescht einen Benutzer aus Keycloak")
    public ResponseEntity<Void> deleteUser(
            @PathVariable String id,
            JwtAuthenticationToken auth,
            HttpServletRequest request) {
        userService.deleteUser(id);
        auditService.logAction(
                auth.getToken().getSubject(), auth.getName(),
                "DELETE_USER", "/api/v1/users/" + id,
                "User geloescht: " + id,
                request.getRemoteAddr()
        );
        return ResponseEntity.noContent().build();
    }
}
