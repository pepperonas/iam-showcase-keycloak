package io.celox.keycloak.events;

import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

/**
 * Factory fuer den Celox Audit Event Listener.
 * Registriert sich als Keycloak SPI mit der ID "celox-audit-listener".
 */
public class AuditEventListenerProviderFactory implements EventListenerProviderFactory {

    public static final String PROVIDER_ID = "celox-audit-listener";

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new AuditEventListenerProvider();
    }

    @Override
    public void init(Config.Scope config) {
        // Keine Konfiguration erforderlich
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // Keine Post-Init-Logik
    }

    @Override
    public void close() {
        // Keine Ressourcen freizugeben
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}
