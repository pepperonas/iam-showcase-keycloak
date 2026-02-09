package io.celox.iam.controller;

import io.celox.iam.dto.AuditLogDto;
import io.celox.iam.dto.PagedResponse;
import io.celox.iam.service.AuditService;
import io.celox.iam.service.KeycloakAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Administrative Endpoints (nur admin-Rolle)")
@SecurityRequirement(name = "oauth2")
public class AdminController {

    private final KeycloakAdminService keycloakAdminService;
    private final AuditService auditService;

    public AdminController(KeycloakAdminService keycloakAdminService, AuditService auditService) {
        this.keycloakAdminService = keycloakAdminService;
        this.auditService = auditService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Admin Dashboard", description = "Aggregierte Statistiken ueber Users, Rollen etc.")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(keycloakAdminService.getDashboardStats());
    }

    @GetMapping("/audit-log")
    @Operation(summary = "Audit-Log", description = "Paginiertes Audit-Log aller Aktionen")
    public ResponseEntity<PagedResponse<AuditLogDto>> auditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.getAuditLogs(page, size));
    }
}
