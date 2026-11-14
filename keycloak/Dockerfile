# Keycloak als optimierter Build: "start --optimized" spart gegenueber
# "start-dev" die Augmentation bei jedem Start und haelt den Speicherbedarf klein.
ARG KC_VERSION=26.8.2

FROM quay.io/keycloak/keycloak:${KC_VERSION} AS builder
ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true \
    KC_CACHE=local
COPY themes/celox /opt/keycloak/themes/celox
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:${KC_VERSION}
COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY realm-export.json /opt/keycloak/data/import/realm-export.json
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--import-realm"]
