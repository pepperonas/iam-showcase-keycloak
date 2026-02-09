package io.celox.iam.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * SAML2 Konzept-Demo: Stellt SP Metadata XML bereit.
 * Kein vollstaendiger SAML Login-Flow, sondern Nachweis der Konfigurationskompetenz.
 */
@RestController
@RequestMapping("/api/v1/saml")
@Tag(name = "SAML", description = "SAML 2.0 Konzept-Demo")
public class SamlController {

    @Value("${app.keycloak.admin-url:http://localhost:8180}")
    private String keycloakUrl;

    @Value("${app.keycloak.realm:iam-showcase}")
    private String realm;

    @GetMapping(value = "/metadata", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "SP Metadata", description = "SAML Service Provider Metadata XML")
    public ResponseEntity<String> getMetadata() {
        String entityId = "iam-showcase-sp";
        String acsUrl = "http://localhost:8080/api/v1/saml/acs";
        String sloUrl = "http://localhost:8080/api/v1/saml/slo";
        String idpSsoUrl = keycloakUrl + "/realms/" + realm + "/protocol/saml";

        String metadata = """
                <?xml version="1.0" encoding="UTF-8"?>
                <md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                                     entityID="%s"
                                     validUntil="2027-01-01T00:00:00Z">
                    <md:SPSSODescriptor
                        AuthnRequestsSigned="false"
                        WantAssertionsSigned="true"
                        protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">

                        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>

                        <md:AssertionConsumerService
                            Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                            Location="%s"
                            index="0"
                            isDefault="true"/>

                        <md:SingleLogoutService
                            Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                            Location="%s"/>
                    </md:SPSSODescriptor>

                    <!-- Keycloak IdP SSO URL: %s -->
                    <!-- SAML Client in Keycloak Realm '%s' konfiguriert -->
                    <!-- Dies ist eine Konzept-Demo - kein vollstaendiger SAML Login-Flow -->
                </md:EntityDescriptor>
                """.formatted(entityId, acsUrl, sloUrl, idpSsoUrl, realm);

        return ResponseEntity.ok(metadata);
    }
}
