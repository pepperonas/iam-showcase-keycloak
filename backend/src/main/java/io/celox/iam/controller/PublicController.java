package io.celox.iam.controller;

import io.celox.iam.dto.HealthResponse;
import io.celox.iam.dto.InfoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "Public", description = "Oeffentliche Endpoints ohne Authentifizierung")
public class PublicController {

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/health")
    @Operation(summary = "Health Check", description = "Prueft ob der Service erreichbar ist")
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse("UP", Instant.now().toString()));
    }

    @GetMapping("/info")
    @Operation(summary = "App-Info", description = "Gibt Anwendungsinformationen zurueck")
    public ResponseEntity<InfoResponse> info() {
        return ResponseEntity.ok(new InfoResponse(
                "IAM Showcase",
                appVersion,
                "Spring Boot 3.3 + Keycloak 24",
                activeProfile,
                "(c) 2026 Martin Pfeffer | celox.io"
        ));
    }
}
