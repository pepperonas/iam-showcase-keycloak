package io.celox.iam.dto;

public record InfoResponse(
        String name,
        String version,
        String stack,
        String profile,
        String copyright
) {}
