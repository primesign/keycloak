/*
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
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

package org.keycloak.authentication;

import org.keycloak.models.Constants;
import org.keycloak.sessions.AuthenticationSessionModel;

public class AuthenticatorUtil {

    public static int getRequestedLevelOfAuthentication(AuthenticationSessionModel authSession) {
        String requestedLoa = authSession.getClientNote(Constants.LEVEL_OF_AUTHENTICATION);
        return requestedLoa == null ? -1 : Integer.parseInt(requestedLoa);
    }

    public static int getCurrentLevelOfAuthentication(AuthenticationSessionModel authSession) {
        String authSessionLoa = authSession.getAuthNote(Constants.LEVEL_OF_AUTHENTICATION);
        String userSessionLoa = authSession.getUserSessionNotes().get(Constants.LEVEL_OF_AUTHENTICATION);
        return authSessionLoa == null
            ? userSessionLoa == null ? -1 : Integer.parseInt(userSessionLoa)
            : userSessionLoa == null ? Integer.parseInt(authSessionLoa)
            : Math.max(Integer.parseInt(authSessionLoa), Integer.parseInt(userSessionLoa));
    }

    public static boolean isLevelOfAuthenticationSatisfied(AuthenticationSessionModel authSession) {
        return AuthenticatorUtil.getRequestedLevelOfAuthentication(authSession)
            <= AuthenticatorUtil.getCurrentLevelOfAuthentication(authSession);
    }
}
