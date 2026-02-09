package io.celox.iam.dto;

import java.util.List;
import java.util.Map;

public record TokenInspectResponse(
        String subject,
        String preferredUsername,
        String email,
        String name,
        List<String> realmRoles,
        List<String> clientRoles,
        Map<String, Object> header,
        Map<String, Object> claims,
        String issuedAt,
        String expiresAt,
        long expiresInSeconds
) {}
