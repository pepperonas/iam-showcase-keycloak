package io.celox.iam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateUserDto(
        @NotBlank String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        String firstName,
        String lastName,
        List<String> realmRoles,
        List<String> clientRoles
) {}
