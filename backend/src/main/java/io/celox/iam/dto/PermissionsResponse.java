package io.celox.iam.dto;

import java.util.List;
import java.util.Map;

public record PermissionsResponse(
        String username,
        List<String> realmRoles,
        List<String> clientRoles,
        List<String> effectiveAuthorities,
        Map<String, Boolean> permissionMatrix
) {}
