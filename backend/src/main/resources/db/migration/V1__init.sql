-- Initiales Schema fuer IAM Showcase
-- Tabelle fuer anwendungsspezifische Benutzerdaten (ergaenzend zu Keycloak)
CREATE TABLE IF NOT EXISTS app_users (
    id          BIGSERIAL PRIMARY KEY,
    keycloak_id VARCHAR(255) NOT NULL UNIQUE,
    username    VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    first_name  VARCHAR(255),
    last_name   VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_users_keycloak_id ON app_users(keycloak_id);
CREATE INDEX idx_app_users_email ON app_users(email);

-- Audit-Log Tabelle
CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     VARCHAR(255),
    username    VARCHAR(255),
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(255),
    detail      TEXT,
    ip_address  VARCHAR(45),
    timestamp   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
