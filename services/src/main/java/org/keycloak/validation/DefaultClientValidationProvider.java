/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.keycloak.validation;

import org.keycloak.common.Profile;
import org.keycloak.models.ClientModel;
import org.keycloak.protocol.ProtocolMapperConfigException;
import org.keycloak.protocol.oidc.OIDCAdvancedConfigWrapper;
import org.keycloak.protocol.oidc.mappers.PairwiseSubMapperHelper;
import org.keycloak.protocol.oidc.utils.PairwiseSubMapperUtils;
import org.keycloak.protocol.oidc.utils.PairwiseSubMapperValidator;
import org.keycloak.protocol.oidc.utils.SubjectType;
import org.keycloak.representations.idm.ProtocolMapperRepresentation;
import org.keycloak.representations.oidc.OIDCClientRepresentation;
import org.keycloak.services.resources.admin.permissions.AdminPermissions;
import org.keycloak.services.util.ResolveRelative;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import static org.keycloak.models.utils.ModelToRepresentation.toRepresentation;

public class DefaultClientValidationProvider implements ClientValidationProvider {
    private enum FieldMessages {
        ROOT_URL("rootUrl",
                "Root URL is not a valid URL", "clientRootURLInvalid",
                "Root URL must not contain an URL fragment", "clientRootURLFragmentError",
                "Root URL uses an illegal scheme", "clientRootURLIllegalSchemeError"),

        BASE_URL("baseUrl",
                "Base URL is not a valid URL", "clientBaseURLInvalid",
                null, null,
                "Base URL uses an illegal scheme", "clientBaseURLIllegalSchemeError"),

        REDIRECT_URIS("redirectUris",
                "A redirect URI is not a valid URI", "clientRedirectURIsInvalid",
                "Redirect URIs must not contain an URI fragment", "clientRedirectURIsFragmentError",
                "A redirect URI uses an illegal scheme", "clientRedirectURIsIllegalSchemeError"),

        BACKCHANNEL_LOGOUT_URL("backchannelLogoutUrl",
                "Backchannel logout URL is not a valid URL", "backchannelLogoutUrlIsInvalid",
                null, null,
                "Backchannel logout URL uses an illegal scheme", "backchannelLogoutUrlIllegalSchemeError");

        private String fieldId;

        private String invalid;
        private String invalidKey;

        private String fragment;
        private String fragmentKey;

        private String scheme;
        private String schemeKey;

        FieldMessages(String fieldId, String invalid, String invalidKey, String fragment, String fragmentKey, String scheme, String schemeKey) {
            this.fieldId = fieldId;
            this.invalid = invalid;
            this.invalidKey = invalidKey;
            this.fragment = fragment;
            this.fragmentKey = fragmentKey;
            this.scheme = scheme;
            this.schemeKey = schemeKey;
        }

        public String getFieldId() {
            return fieldId;
        }

        public String getInvalid() {
            return invalid;
        }

        public String getInvalidKey() {
            return invalidKey;
        }

        public String getFragment() {
            return fragment;
        }

        public String getFragmentKey() {
            return fragmentKey;
        }

        public String getScheme() {
            return scheme;
        }

        public String getSchemeKey() {
            return schemeKey;
        }
    }

    // TODO Before adding more validation consider using a library for validation
    @Override
    public ValidationResult validate(ValidationContext<ClientModel> context) {
        validateUrls(context);
        validatePairwiseInClientModel(context);

        return context.toResult();
    }

    @Override
    public ValidationResult validate(ClientValidationContext.OIDCContext context) {
        validateUrls(context);
        validatePairwiseInOIDCClient(context);

        return context.toResult();
    }

    private void validateUrls(ValidationContext<ClientModel> context) {
        ClientModel client = context.getObjectToValidate();

        // Use a fake URL for validating relative URLs as we may not be validating clients in the context of a request (import at startup)
        String authServerUrl = "https://localhost/auth";

        String rootUrl = ResolveRelative.resolveRootUrl(authServerUrl, authServerUrl, client.getRootUrl());

        // don't need to use actual rootUrl here as it'd interfere with others URL validations
        String baseUrl = ResolveRelative.resolveRelativeUri(authServerUrl, authServerUrl, authServerUrl, client.getBaseUrl());

        String backchannelLogoutUrl = OIDCAdvancedConfigWrapper.fromClientModel(client).getBackchannelLogoutUrl();
        String resolvedBackchannelLogoutUrl =
                ResolveRelative.resolveRelativeUri(authServerUrl, authServerUrl, authServerUrl, backchannelLogoutUrl);

        // Check if the client allows regex in the redirect uri fields  
        boolean allowRegexRedirectUri;
        if (Profile.isFeatureEnabled(Profile.Feature.ADMIN_FINE_GRAINED_AUTHZ)) {
            allowRegexRedirectUri = AdminPermissions.management(context.getSession(), context.getSession().getContext().getRealm())
                .clients().allowRegexRedirectUri(client);
        } else {
            allowRegexRedirectUri = false;
        }
      

        checkUri(FieldMessages.ROOT_URL, rootUrl, context, true, true, false);
        checkUri(FieldMessages.BASE_URL, baseUrl, context, true, false, false);
        checkUri(FieldMessages.BACKCHANNEL_LOGOUT_URL, resolvedBackchannelLogoutUrl, context, true, false, false);
        client.getRedirectUris().stream()
                .map(u -> ResolveRelative.resolveRelativeUri(authServerUrl, authServerUrl, rootUrl, u))
                .forEach(u -> checkUri(FieldMessages.REDIRECT_URIS, u, context, false, true, allowRegexRedirectUri));
    }

    private void checkUri(FieldMessages field, String url, ValidationContext<ClientModel> context, boolean checkValidUrl, boolean checkFragment, boolean allowRegexRedirectUri) {
        if (url == null || url.isEmpty()) {
            return;
        }

        if (allowRegexRedirectUri) {
          try {
            Pattern.compile(url);
          } catch (PatternSyntaxException e) {
            context.addError(field.getFieldId(), field.getInvalid(), field.getInvalidKey());
          }
          return;
        }

        try {
            URI uri = new URI(url);

            boolean valid = true;
            if (uri.getScheme() != null && (uri.getScheme().equals("data") || uri.getScheme().equals("javascript"))) {
                context.addError(field.getFieldId(), field.getScheme(), field.getSchemeKey());
                valid = false;
            }

            // KEYCLOAK-3421
            if (checkFragment && uri.getFragment() != null) {
                context.addError(field.getFieldId(), field.getFragment(), field.getFragmentKey());
                valid = false;
            }

            // Don't check if URL is valid if there are other problems with it; otherwise it could lead to duplicit errors.
            // This cannot be moved higher because it acts on differently based on environment (e.g. sometimes it checks
            // scheme, sometimes it doesn't).
            if (checkValidUrl && valid) {
                uri.toURL(); // throws an exception
            }
        }
        catch (MalformedURLException | IllegalArgumentException | URISyntaxException e) {
            context.addError(field.getFieldId(), field.getInvalid(), field.getInvalidKey());
        }
    }

    private void validatePairwiseInClientModel(ValidationContext<ClientModel> context) {
        List<ProtocolMapperRepresentation> foundPairwiseMappers = PairwiseSubMapperUtils.getPairwiseSubMappers(toRepresentation(context.getObjectToValidate(), context.getSession()));

        for (ProtocolMapperRepresentation foundPairwise : foundPairwiseMappers) {
            String sectorIdentifierUri = PairwiseSubMapperHelper.getSectorIdentifierUri(foundPairwise);
            validatePairwise(context, sectorIdentifierUri);
        }
    }

    private void validatePairwiseInOIDCClient(ClientValidationContext.OIDCContext context) {
        OIDCClientRepresentation oidcRep = context.getOIDCClient();

        SubjectType subjectType = SubjectType.parse(oidcRep.getSubjectType());
        String sectorIdentifierUri = oidcRep.getSectorIdentifierUri();

        // If sector_identifier_uri is in oidc config, then always validate it
        if (SubjectType.PAIRWISE == subjectType || (sectorIdentifierUri != null && !sectorIdentifierUri.isEmpty())) {
            validatePairwise(context, oidcRep.getSectorIdentifierUri());
        }
    }

    private void validatePairwise(ValidationContext<ClientModel> context, String sectorIdentifierUri) {
        ClientModel client = context.getObjectToValidate();
        String rootUrl = client.getRootUrl();
        Set<String> redirectUris = new HashSet<>();
        if (client.getRedirectUris() != null) redirectUris.addAll(client.getRedirectUris());

        try {
            PairwiseSubMapperValidator.validate(context.getSession(), rootUrl, redirectUris, sectorIdentifierUri);
        } catch (ProtocolMapperConfigException e) {
            context.addError("pairWise", e.getMessage(), e.getMessageKey());
        }
    }

}
