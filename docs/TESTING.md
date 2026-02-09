# Test-Strategie

## Backend (Java/Spring Boot)

### Unit Tests
- **Framework:** JUnit 5
- **Mocking:** Mockito (Standard) + EasyMock (demonstriert beide Frameworks)
- **Scope:** Services, Converter, DTOs

### Security Tests
- **Mock JWT:** `@WithMockUser`, `SecurityMockMvcRequestPostProcessors.jwt()`
- **RBAC Tests:** Alle Rollen-Kombinationen gegen alle Endpoints
- **Scope:** SecurityConfig, Zugriffsregeln

### Integration Tests
- **Testcontainers:** PostgreSQL + Keycloak Container
- **Scope:** Kompletter Request-Lifecycle, DB-Operationen

### DB Tests
- **Schema:** Flyway Migrationen
- **Fixtures:** DBUnit fuer Test-Daten

### Coverage
- **Tool:** Jacoco Maven Plugin
- **Minimum:** 80% Line Coverage
- **Report:** `backend/target/site/jacoco/`

## Frontend (React/TypeScript)

### Unit Tests
- **Framework:** Vitest
- **DOM Testing:** @testing-library/react
- **Mocking:** vi.mock fuer OIDC-Context

### Test-Dateien
- `App.test.tsx` - Routing, Auth-State
- `PermissionMatrix.test.tsx` - Matrix-Rendering
- `TokenInspector.test.tsx` - Token-Anzeige

## Ausfuehrung

```bash
# Backend Tests
cd backend && mvn clean verify

# Frontend Tests
cd frontend && npm test

# Alle Tests
mvn clean verify && cd ../frontend && npm test
```

(c) 2026 Martin Pfeffer | celox.io
