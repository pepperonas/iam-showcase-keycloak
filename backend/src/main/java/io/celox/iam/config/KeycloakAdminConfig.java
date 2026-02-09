package io.celox.iam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class KeycloakAdminConfig implements WebMvcConfigurer {

    private final AuditInterceptor auditInterceptor;

    public KeycloakAdminConfig(AuditInterceptor auditInterceptor) {
        this.auditInterceptor = auditInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor)
                .addPathPatterns("/api/v1/**")
                .excludePathPatterns("/api/v1/public/**");
    }
}
