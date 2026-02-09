package io.celox.iam.dto;

import java.util.List;

public record UserDto(
        String id,
        String username,
        String email,
        String firstName,
        String lastName,
        boolean enabled,
        List<String> realmRoles,
        List<String> clientRoles,
        String createdTimestamp
) {}
