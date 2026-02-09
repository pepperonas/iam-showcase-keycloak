package io.celox.iam.dto;

import java.time.Instant;

public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,
        String timestamp
) {
    public ErrorResponse(int status, String error, String message, String path) {
        this(status, error, message, path, Instant.now().toString());
    }
}
