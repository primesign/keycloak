package org.keycloak.authentication.authenticators.conditional;

import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticatorUtil;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.sessions.AuthenticationSessionModel;

public class ConditionalLoaAuthenticator implements ConditionalAuthenticator {

  static final String LEVEL = "loa-condition-level";

  private static final Logger logger = Logger.getLogger(ConditionalLoaAuthenticator.class);

  @Override
  public boolean matchCondition(AuthenticationFlowContext context) {
    AuthenticationSessionModel authSession = context.getAuthenticationSession();
    int currentLoa = AuthenticatorUtil.getCurrentLevelOfAuthentication(authSession);
    int requestedLoa = AuthenticatorUtil.getRequestedLevelOfAuthentication(authSession);
    int configuredLoa = getConfiguredLoa(context);
    return currentLoa < configuredLoa && (requestedLoa >= configuredLoa || requestedLoa < 0);
  }

  private int getConfiguredLoa(AuthenticationFlowContext context) {
    try {
      return Integer.parseInt(context.getAuthenticatorConfig().getConfig().get(LEVEL));
    } catch (NullPointerException | NumberFormatException e) {
      logger.errorv("Invalid configuration: {0}", LEVEL);
      return Integer.MAX_VALUE;
    }
  }

  @Override
  public void action(AuthenticationFlowContext context) { }

  @Override
  public boolean requiresUser() {
    return false;
  }

  @Override
  public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) { }

  @Override
  public void close() { }
}
