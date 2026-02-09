package io.celox.keycloak.events;

import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Custom Keycloak Event Listener, der Login/Logout/Register Events
 * als strukturiertes JSON loggt. Dient als Audit-Trail fuer das IAM-System.
 */
public class AuditEventListenerProvider implements EventListenerProvider {

    private static final Logger LOG = Logger.getLogger(AuditEventListenerProvider.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withZone(ZoneId.of("UTC"));

    @Override
    public void onEvent(Event event) {
        String timestamp = FORMATTER.format(Instant.ofEpochMilli(event.getTime()));
        String details = event.getDetails() != null
                ? event.getDetails().entrySet().stream()
                    .map(e -> "\"" + e.getKey() + "\":\"" + e.getValue() + "\"")
                    .collect(Collectors.joining(","))
                : "";

        String json = String.format(
                "{\"type\":\"USER_EVENT\",\"eventType\":\"%s\",\"realmId\":\"%s\","
                + "\"userId\":\"%s\",\"clientId\":\"%s\",\"ipAddress\":\"%s\","
                + "\"timestamp\":\"%s\",\"error\":\"%s\",\"details\":{%s}}",
                event.getType(),
                event.getRealmId(),
                event.getUserId() != null ? event.getUserId() : "",
                event.getClientId() != null ? event.getClientId() : "",
                event.getIpAddress() != null ? event.getIpAddress() : "",
                timestamp,
                event.getError() != null ? event.getError() : "",
                details
        );

        if (isErrorEvent(event.getType())) {
            LOG.warnf("[CELOX-AUDIT] %s", json);
        } else {
            LOG.infof("[CELOX-AUDIT] %s", json);
        }
    }

    @Override
    public void onEvent(AdminEvent event, boolean includeRepresentation) {
        String timestamp = FORMATTER.format(Instant.ofEpochMilli(event.getTime()));

        String json = String.format(
                "{\"type\":\"ADMIN_EVENT\",\"operationType\":\"%s\",\"realmId\":\"%s\","
                + "\"resourceType\":\"%s\",\"resourcePath\":\"%s\","
                + "\"authRealmId\":\"%s\",\"authClientId\":\"%s\",\"authUserId\":\"%s\","
                + "\"timestamp\":\"%s\",\"error\":\"%s\"}",
                event.getOperationType(),
                event.getRealmId(),
                event.getResourceType() != null ? event.getResourceType() : "",
                event.getResourcePath() != null ? event.getResourcePath() : "",
                event.getAuthDetails() != null ? event.getAuthDetails().getRealmId() : "",
                event.getAuthDetails() != null ? event.getAuthDetails().getClientId() : "",
                event.getAuthDetails() != null ? event.getAuthDetails().getUserId() : "",
                timestamp,
                event.getError() != null ? event.getError() : ""
        );

        LOG.infof("[CELOX-AUDIT] %s", json);
    }

    @Override
    public void close() {
        // Keine Ressourcen freizugeben
    }

    private boolean isErrorEvent(EventType type) {
        return type != null && type.name().endsWith("_ERROR");
    }
}
