package io.celox.iam.config;

import io.celox.iam.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuditInterceptor implements HandlerInterceptor {

    private final AuditService auditService;

    public AuditInterceptor(AuditService auditService) {
        this.auditService = auditService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String method = request.getMethod();
        // Nur schreibende Zugriffe loggen
        if ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method)) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth instanceof JwtAuthenticationToken jwtAuth) {
                auditService.logAction(
                        jwtAuth.getToken().getSubject(),
                        jwtAuth.getName(),
                        "API_" + method,
                        request.getRequestURI(),
                        null,
                        request.getRemoteAddr()
                );
            }
        }
        return true;
    }
}
