import { FormGroup } from "@patternfly/react-core";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HelpItem } from "ui-shared";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { MultiLineInput } from "../../components/multi-line-input/MultiLineInput";
import { useRealm } from "../../context/realm-context/RealmContext";
import environment from "../../environment";
import { convertAttributeNameToForm } from "../../util";
import { FormFields } from "../ClientDetails";

type LoginSettingsProps = {
  protocol?: string;
  isDisabled?: boolean;
};

export const LoginSettings = ({
  protocol = "openid-connect",
  ...rest
}: LoginSettingsProps) => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<FormFields>();
  const { realm } = useRealm();

  const idpInitiatedSsoUrlName: string = watch(
    "attributes.saml_idp_initiated_sso_url_name",
  );

  const standardFlowEnabled = watch("standardFlowEnabled");
  return (
    <>
      <FormGroup
        label={t("identityProviders")}
        fieldId="identityProviders"
        labelIcon={
          <HelpItem
            helpText={t("identityProvidersHelp")}
            fieldLabelId="clients:identityProviders"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="identityProviders"
          {...register("attributes.identityProviders")}
        />
      </FormGroup>
      <FormGroup
        label={t("rootUrl")}
        fieldId="kc-root-url"
        labelIcon={
          <HelpItem helpText={t("rootURLHelp")} fieldLabelId="rootUrl" />
        }
      >
        <KeycloakTextInput
          id="kc-root-url"
          type="url"
          {...register("rootUrl")}
          {...rest}
        />
      </FormGroup>
      <FormGroup
        label={t("homeURL")}
        fieldId="kc-home-url"
        labelIcon={
          <HelpItem helpText={t("homeURLHelp")} fieldLabelId="homeURL" />
        }
      >
        <KeycloakTextInput
          id="kc-home-url"
          type="url"
          {...register("baseUrl")}
          {...rest}
        />
      </FormGroup>
      {standardFlowEnabled && (
        <>
          <FormGroup
            label={t("validRedirectUri")}
            fieldId="kc-redirect"
            labelIcon={
              <HelpItem
                helpText={t("validRedirectURIsHelp")}
                fieldLabelId="validRedirectUri"
              />
            }
          >
            <MultiLineInput
              id="kc-redirect"
              name="redirectUris"
              aria-label={t("validRedirectUri")}
              addButtonLabel="addRedirectUri"
              {...rest}
            />
          </FormGroup>
          <FormGroup
            label={t("validPostLogoutRedirectUri")}
            fieldId="kc-postLogoutRedirect"
            labelIcon={
              <HelpItem
                helpText={t("validPostLogoutRedirectURIsHelp")}
                fieldLabelId="validPostLogoutRedirectUri"
              />
            }
          >
            <MultiLineInput
              id="kc-postLogoutRedirect"
              name={convertAttributeNameToForm(
                "attributes.post.logout.redirect.uris",
              )}
              aria-label={t("validPostLogoutRedirectUri")}
              addButtonLabel="addPostLogoutRedirectUri"
              stringify
              {...rest}
            />
          </FormGroup>{" "}
        </>
      )}
      {protocol === "saml" && (
        <>
          <FormGroup
            label={t("idpInitiatedSsoUrlName")}
            fieldId="idpInitiatedSsoUrlName"
            labelIcon={
              <HelpItem
                helpText={t("idpInitiatedSsoUrlNameHelp")}
                fieldLabelId="idpInitiatedSsoUrlName"
              />
            }
            helperText={
              idpInitiatedSsoUrlName !== "" &&
              t("idpInitiatedSsoUrlNameHelp", {
                url: `${environment.authServerUrl}/realms/${realm}/protocol/saml/clients/${idpInitiatedSsoUrlName}`,
              })
            }
          >
            <KeycloakTextInput
              id="idpInitiatedSsoUrlName"
              data-testid="idpInitiatedSsoUrlName"
              {...register("attributes.saml_idp_initiated_sso_url_name")}
              {...rest}
            />
          </FormGroup>
          <FormGroup
            label={t("idpInitiatedSsoRelayState")}
            fieldId="idpInitiatedSsoRelayState"
            labelIcon={
              <HelpItem
                helpText={t("idpInitiatedSsoRelayStateHelp")}
                fieldLabelId="idpInitiatedSsoRelayState"
              />
            }
          >
            <KeycloakTextInput
              id="idpInitiatedSsoRelayState"
              data-testid="idpInitiatedSsoRelayState"
              {...register("attributes.saml_idp_initiated_sso_relay_state")}
              {...rest}
            />
          </FormGroup>
          <FormGroup
            label={t("masterSamlProcessingUrl")}
            fieldId="masterSamlProcessingUrl"
            labelIcon={
              <HelpItem
                helpText={t("masterSamlProcessingUrlHelp")}
                fieldLabelId="masterSamlProcessingUrl"
              />
            }
          >
            <KeycloakTextInput
              id="masterSamlProcessingUrl"
              type="url"
              data-testid="masterSamlProcessingUrl"
              {...register("adminUrl")}
              {...rest}
            />
          </FormGroup>
        </>
      )}
      {protocol !== "saml" && standardFlowEnabled && (
        <FormGroup
          label={t("webOrigins")}
          fieldId="kc-web-origins"
          labelIcon={
            <HelpItem
              helpText={t("webOriginsHelp")}
              fieldLabelId="webOrigins"
            />
          }
        >
          <MultiLineInput
            id="kc-web-origins"
            name="webOrigins"
            aria-label={t("webOrigins")}
            addButtonLabel="addWebOrigins"
            {...rest}
          />
        </FormGroup>
      )}
    </>
  );
};
