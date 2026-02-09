package io.celox.iam.controller;

import io.celox.iam.dto.PermissionsResponse;
import io.celox.iam.dto.TokenInspectResponse;
import io.celox.iam.service.TokenInspectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/token")
@Tag(name = "Token", description = "JWT Token Inspection und Berechtigungs-Analyse")
@SecurityRequirement(name = "oauth2")
public class TokenController {

    private final TokenInspectionService tokenInspectionService;

    public TokenController(TokenInspectionService tokenInspectionService) {
        this.tokenInspectionService = tokenInspectionService;
    }

    @GetMapping("/inspect")
    @Operation(summary = "Token inspizieren", description = "Decodiert den JWT Token und zeigt Header, Claims und Rollen")
    public ResponseEntity<TokenInspectResponse> inspectToken(JwtAuthenticationToken authentication) {
        return ResponseEntity.ok(tokenInspectionService.inspectToken(authentication));
    }

    @GetMapping("/permissions")
    @Operation(summary = "Berechtigungen anzeigen", description = "Zeigt effektive Rollen und Permission Matrix")
    public ResponseEntity<PermissionsResponse> getPermissions(JwtAuthenticationToken authentication) {
        return ResponseEntity.ok(tokenInspectionService.getPermissions(authentication));
    }
}
