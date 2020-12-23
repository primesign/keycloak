package org.keycloak.authentication.authenticators.browser;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.Constants;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.sessions.AuthenticationSessionModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoaAuthenticator implements Authenticator {

  private static final Logger LOGGER = LoggerFactory.getLogger(LoaAuthenticator.class);

  static final String LEVEL = "loa-level";
  static final String STORE_IN_USER_SESSION = "loa-store-in-user-session";

  @Override
  public void authenticate(AuthenticationFlowContext context) {
    AuthenticationSessionModel authSession = context.getAuthenticationSession();
    int currentLoa = Math.max(getConfiguredLoa(context), getCurrentLoa(authSession));
    authSession.setAuthNote(Constants.LEVEL_OF_AUTHENTICATION, String.valueOf(currentLoa));
    if (isStoreInUserSession(context)) {
      authSession.setUserSessionNote(Constants.LEVEL_OF_AUTHENTICATION, String.valueOf(currentLoa));
    }
    // Checking if the requested LOA has been satisfied is not necessary,
    // because that is done in the flow processing anyway.
    context.success();
  }

  @Override
  public void action(AuthenticationFlowContext context) {
  }

  @Override
  public boolean requiresUser() {
    return true;
  }

  @Override
  public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
    return true;
  }

  @Override
  public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
  }

  @Override
  public void close() {
  }

  private boolean isStoreInUserSession(AuthenticationFlowContext context) {
    try {
      return Boolean.parseBoolean(context.getAuthenticatorConfig().getConfig().get(STORE_IN_USER_SESSION));
    } catch (NullPointerException | NumberFormatException e) {
      LOGGER.error("Invalid configuration: {}", STORE_IN_USER_SESSION);
      return false;
    }
  }

  private int getConfiguredLoa(AuthenticationFlowContext context) {
    try {
      return Integer.parseInt(context.getAuthenticatorConfig().getConfig().get(LEVEL));
    } catch (NullPointerException | NumberFormatException e) {
      LOGGER.error("Invalid configuration: {}", LEVEL);
      return -1;
    }
  }

  private int getCurrentLoa(AuthenticationSessionModel authSession) {
    String currentLoa = authSession.getAuthNote(Constants.LEVEL_OF_AUTHENTICATION);
    if (currentLoa == null) {
      currentLoa = authSession.getUserSessionNotes().get(Constants.LEVEL_OF_AUTHENTICATION);
      if (currentLoa == null) {
        return -1;
      }
    }
    try {
      return Integer.parseInt(currentLoa);
    } catch (NumberFormatException e) {
      return -1;
    }
  }
}
