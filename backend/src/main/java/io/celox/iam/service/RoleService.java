package io.celox.iam.service;

import io.celox.iam.dto.RoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final KeycloakAdminService keycloakAdminService;

    public RoleService(KeycloakAdminService keycloakAdminService) {
        this.keycloakAdminService = keycloakAdminService;
    }

    public List<RoleDto> getAllRoles() {
        return keycloakAdminService.getAllRoles();
    }

    public List<RoleDto> getRealmRoles() {
        return keycloakAdminService.getRealmRoles();
    }

    public List<RoleDto> getClientRoles() {
        return keycloakAdminService.getClientRoles();
    }
}
