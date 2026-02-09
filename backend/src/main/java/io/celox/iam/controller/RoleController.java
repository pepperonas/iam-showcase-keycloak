package io.celox.iam.controller;

import io.celox.iam.dto.RoleDto;
import io.celox.iam.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@Tag(name = "Roles", description = "Rollenverwaltung")
@SecurityRequirement(name = "oauth2")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @Operation(summary = "Rollen auflisten", description = "Alle Realm- und Client-Rollen")
    public ResponseEntity<List<RoleDto>> getRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }
}
