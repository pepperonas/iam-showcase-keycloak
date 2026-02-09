package io.celox.iam.dto;

public record RoleDto(
        String id,
        String name,
        String description,
        boolean composite,
        boolean clientRole
) {}
