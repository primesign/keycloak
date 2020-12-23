package org.keycloak.authentication.authenticators.browser;

import java.util.List;
import org.keycloak.Config;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;

public class LoaAuthenticatorFactory implements AuthenticatorFactory {

  private static final String PROVIDER_ID = "auth-level-of-authentication";
  private static final LoaAuthenticator SINGLETON = new LoaAuthenticator();
  private static final AuthenticationExecutionModel.Requirement[] REQUIREMENT_CHOICES
      = new AuthenticationExecutionModel.Requirement[]{AuthenticationExecutionModel.Requirement.REQUIRED};

  private static final List<ProviderConfigProperty> CONFIG = ProviderConfigurationBuilder.create()
      .property()
      .name(LoaAuthenticator.LEVEL)
      .label(LoaAuthenticator.LEVEL)
      .helpText(LoaAuthenticator.LEVEL + ".tooltip")
      .type(ProviderConfigProperty.STRING_TYPE)
      .add()
      .property()
      .name(LoaAuthenticator.STORE_IN_USER_SESSION)
      .label(LoaAuthenticator.STORE_IN_USER_SESSION)
      .helpText(LoaAuthenticator.STORE_IN_USER_SESSION + ".tooltip")
      .type(ProviderConfigProperty.BOOLEAN_TYPE)
      .defaultValue("true")
      .add()
      .build();

  @Override
  public String getDisplayType() {
    return "Level of Authentication";
  }

  @Override
  public String getReferenceCategory() {
    return "loa";
  }

  @Override
  public boolean isConfigurable() {
    return true;
  }

  @Override
  public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
    return REQUIREMENT_CHOICES;
  }

  @Override
  public boolean isUserSetupAllowed() {
    return false;
  }

  @Override
  public String getHelpText() {
    return "Sets the Level of Authentication (LOA) and checks if the requested LOA has been satisfied.";
  }

  @Override
  public List<ProviderConfigProperty> getConfigProperties() {
    return CONFIG;
  }

  @Override
  public Authenticator create(KeycloakSession session) {
    return SINGLETON;
  }

  @Override
  public void init(Config.Scope config) {
  }

  @Override
  public void postInit(KeycloakSessionFactory factory) {
  }

  @Override
  public void close() {
  }

  @Override
  public String getId() {
    return PROVIDER_ID;
  }
}
