package io.celox.iam.dto;

public record AuditLogDto(
        Long id,
        String userId,
        String username,
        String action,
        String resource,
        String detail,
        String ipAddress,
        String timestamp
) {}
