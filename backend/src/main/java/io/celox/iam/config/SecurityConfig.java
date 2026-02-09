package io.celox.iam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final KeycloakJwtConverter keycloakJwtConverter;

    public SecurityConfig(KeycloakJwtConverter keycloakJwtConverter) {
        this.keycloakJwtConverter = keycloakJwtConverter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Oeffentliche Endpoints
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/saml/metadata").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                // Admin-Endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("admin")
                // User-Management RBAC
                .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("api-admin")
                .requestMatchers(HttpMethod.POST, "/api/v1/users/**").hasRole("api-write")
                .requestMatchers(HttpMethod.PUT, "/api/v1/users/**").hasRole("api-write")
                .requestMatchers(HttpMethod.GET, "/api/v1/users/**").hasRole("api-read")
                // Rollen-Endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/roles/**").hasRole("api-read")
                // Alles andere: authentifiziert
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter))
            );

        return http.build();
    }
}
