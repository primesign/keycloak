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

    public static boolean isLevelOfAuthenticationForced(AuthenticationSessionModel authSession) {
        return Boolean.parseBoolean(authSession.getClientNote(Constants.FORCE_LEVEL_OF_AUTHENTICATION));
    }

    public static int getRequestedLevelOfAuthentication(AuthenticationSessionModel authSession) {
        String requiredLoa = authSession.getClientNote(Constants.REQUESTED_LEVEL_OF_AUTHENTICATION);
        return requiredLoa == null ? Constants.INVALID_LOA : Integer.parseInt(requiredLoa);
    }

    public static int getCurrentLevelOfAuthentication(AuthenticationSessionModel authSession) {
        String authSessionLoaNote = authSession.getAuthNote(Constants.LEVEL_OF_AUTHENTICATION);
        String userSessionLoaNote = authSession.getUserSessionNotes().get(Constants.LEVEL_OF_AUTHENTICATION);
        int authSessionLoa = authSessionLoaNote == null ? Constants.INVALID_LOA : Integer.parseInt(authSessionLoaNote);
        int userSessionLoa = userSessionLoaNote == null ? Constants.INVALID_LOA : Integer.parseInt(userSessionLoaNote);
        return Math.max(authSessionLoa, userSessionLoa);
    }

    public static boolean isLevelOfAuthenticationSatisfied(AuthenticationSessionModel authSession) {
        return AuthenticatorUtil.getRequestedLevelOfAuthentication(authSession)
            <= AuthenticatorUtil.getCurrentLevelOfAuthentication(authSession);
    }
}
