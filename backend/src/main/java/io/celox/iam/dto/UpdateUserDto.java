package io.celox.iam.dto;

import jakarta.validation.constraints.Email;

import java.util.List;

public record UpdateUserDto(
        @Email String email,
        String firstName,
        String lastName,
        Boolean enabled,
        List<String> realmRoles,
        List<String> clientRoles
) {}
