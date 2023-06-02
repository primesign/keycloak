import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  FormGroup,
  NumberInput,
  PageSection,
  SelectOption,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { FormAccess } from "../../components/form/FormAccess";
import { Controller, useForm } from "react-hook-form";
import useToggle from "../../utils/useToggle";
import { useAdminClient } from "../../admin-client";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useAlerts } from "@keycloak/keycloak-ui-shared";
import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
} from "@keycloak/keycloak-ui-shared";

type SmsPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
};

export const SmsPolicy = ({ realm, realmUpdated }: SmsPolicyProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm({ mode: "onChange" });

  const { realm: realmName } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [openDefaultGateway, toggleDefaultGateway] = useToggle();
  const [openFallbackGateway, toggleFallbackGateway] = useToggle();
  const [openSenderAddressType, toggleSenderAddressType] = useToggle();
  const [openAuthMethod, toggleAuthMethod] = useToggle();

  const [expanded, setExpanded] = useState([""]);
  const [smsatAuthMethod, setSmsAuthMethod] = useState("basic");

  const toggleAccordion = (id: any) => {
    const index = expanded.indexOf(id);
    const newExpanded: string[] =
      index < 0
        ? [...expanded, id]
        : [
            ...expanded.slice(0, index),
            ...expanded.slice(index + 1, expanded.length),
          ];
    setExpanded(newExpanded);
  };

  const SMS_GATEWAYS = [
    {
      key: "smsat",
      title: t("smsatTitle"),
    },
    {
      key: "nexmo",
      title: t("nexmoTitle"),
    },
  ] as const;

  const SENDER_ADDRESS_TYPES = [
    {
      key: "national",
      title: t("smsatSenderAddressTypeNational"),
    },
    {
      key: "international",
      title: t("smsatSenderAddressTypeInternational"),
    },
    {
      key: "alphanumeric",
      title: t("smsatSenderAddressTypeAlphanumeric"),
    },
    {
      key: "shortcode",
      title: t("smsatSenderAddressTypeShortcode"),
    },
  ] as const;

  const AUTH_METHOD = [
    {
      key: "basic",
      title: t("smsatAuthMethodBasic"),
    },
    {
      key: "token",
      title: t("smsatAuthMethodToken"),
    },
  ] as const;

  const setupForm = (realm: RealmRepresentation) => {
    reset({
      ...realm,
    });
    setSmsAuthMethod(
      realm.attributes?.["smsatAuthMethod"]
        ? realm.attributes["smsatAuthMethod"]
        : "basic",
    );
  };

  useEffect(() => setupForm(realm), []);

  const prepareRealmAttributes = async (
    updatedAttributes: RealmRepresentation,
  ) => {
    const currentRealm = await adminClient.realms.findOne({
      realm: realmName,
    });
    if (currentRealm) {
      realm.attributes = {
        ...currentRealm.attributes,
        ...updatedAttributes.attributes,
      };
      return realm;
    } else {
      throw "Realm not found.";
    }
  };

  const save = async (input: RealmRepresentation) => {
    try {
      const merge = await prepareRealmAttributes(input);
      await adminClient.realms.update({ realm: realmName }, merge);
      const updatedRealm = await adminClient.realms.findOne({
        realm: realmName,
      });
      realmUpdated(updatedRealm!);
      setupForm(updatedRealm!);
      addAlert(t("smsUpdateSuccess"), AlertVariant.success);
    } catch (error) {
      addError("smsUpdateError", error);
    }
  };

  return (
    <PageSection variant="light">
      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={handleSubmit(save)}
        className="keycloak__sms_policies_authentication__form"
      >
        <FormGroup
          label={t("smsDefaultGateway")}
          labelIcon={
            <HelpItem
              helpText={t(`smsDefaultGatewayHelpText`)}
              fieldLabelId={`smsDefaultGateway`}
            />
          }
          fieldId="attributes.smsDefaultGateway"
        >
          <Controller
            name="attributes.smsDefaultGateway"
            defaultValue={SMS_GATEWAYS[0].key}
            control={control}
            render={({ field }) => (
              <KeycloakSelect
                toggleId="attributes.smsDefaultGateway"
                onToggle={toggleDefaultGateway}
                onSelect={(selectedValue) => {
                  field.onChange(selectedValue.toString());
                  toggleDefaultGateway();
                }}
                selections={field.value}
                variant={SelectVariant.single}
                aria-label={t("smsDefaultGateway")}
                // typeAheadAriaLabel={t("smsDefaultGateway")}
                isOpen={openDefaultGateway}
                validated={ValidatedOptions.default}
              >
                {SMS_GATEWAYS.map((option) => (
                  <SelectOption
                    selected={option.key === field.value}
                    key={option.key}
                    value={option.key}
                  >
                    {option.title}
                  </SelectOption>
                ))}
              </KeycloakSelect>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("smsFallbackGateway")}
          labelIcon={
            <HelpItem
              helpText={t(`smsFallbackGatewayHelpText`)}
              fieldLabelId={`smsFallbackGateway`}
            />
          }
          fieldId="attributes.smsFallbackGateway"
        >
          <Controller
            name="attributes.smsFallbackGateway"
            defaultValue={SMS_GATEWAYS[0].key}
            control={control}
            render={({ field }) => (
              <KeycloakSelect
                toggleId="attributes.smsFallbackGateway"
                onToggle={toggleFallbackGateway}
                onSelect={(selectedValue) => {
                  field.onChange(selectedValue as string);
                  toggleFallbackGateway();
                }}
                selections={field.value}
                variant={SelectVariant.single}
                aria-label={t("smsFallbackGateway")}
                // typeAheadAriaLabel={t("smsFallbackGateway")}
                validated={ValidatedOptions.default}
                isOpen={openFallbackGateway}
              >
                {SMS_GATEWAYS.map((option) => (
                  <SelectOption
                    selected={option.key === field.value}
                    key={option.key}
                    value={option.key}
                  >
                    {option.title}
                  </SelectOption>
                ))}
              </KeycloakSelect>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("smsTimeout")}
          labelIcon={
            <HelpItem
              helpText={t("smsTimeoutHelpText")}
              fieldLabelId="smsTimeout"
            />
          }
          fieldId="attributes.smsTimeout"
        >
          <Controller
            name="attributes.smsTimeout"
            defaultValue={5}
            control={control}
            rules={{ min: 0, max: 120 }}
            render={({ field }) => {
              const MIN_VALUE = 0;
              const setValue = (newValue: number) =>
                field.onChange(Math.max(newValue, MIN_VALUE));

              return (
                <NumberInput
                  id="timeout"
                  value={field.value}
                  min={MIN_VALUE}
                  onPlus={() => setValue(parseInt(field.value) + 1)}
                  onMinus={() => setValue(parseInt(field.value) - 1)}
                  onChange={(event) => {
                    const newValue = Number(event.currentTarget.value);
                    setValue(!isNaN(newValue) ? newValue : 5);
                  }}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("smsTanLength")}
          labelIcon={
            <HelpItem
              helpText={t("smsTanLengthHelpText")}
              fieldLabelId="smsTanLength"
            />
          }
          fieldId="attributes.smsTanLength"
        >
          <Controller
            name="attributes.smsTanLength"
            defaultValue={6}
            control={control}
            rules={{ min: 1, max: 120 }}
            render={({ field }) => {
              const MIN_VALUE = 1;
              const setValue = (newValue: number) =>
                field.onChange(Math.max(newValue, MIN_VALUE));

              return (
                <NumberInput
                  id="tanLength"
                  value={field.value}
                  min={MIN_VALUE}
                  onPlus={() => setValue(parseInt(field.value) + 1)}
                  onMinus={() => setValue(parseInt(field.value) - 1)}
                  onChange={(event) => {
                    const newValue = Number(event.currentTarget.value);
                    setValue(!isNaN(newValue) ? newValue : 6);
                  }}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("smsRefLength")}
          labelIcon={
            <HelpItem
              helpText={t("smsRefLengthHelpText")}
              fieldLabelId="smsRefLength"
            />
          }
          fieldId="attributes.smsRefLength"
        >
          <Controller
            name="attributes.smsRefLength"
            defaultValue={6}
            control={control}
            rules={{ min: 1, max: 120 }}
            render={({ field }) => {
              const MIN_VALUE = 1;
              const setValue = (newValue: number) =>
                field.onChange(Math.max(newValue, MIN_VALUE));

              return (
                <NumberInput
                  id="refLength"
                  value={field.value}
                  min={MIN_VALUE}
                  onPlus={() => setValue(parseInt(field.value) + 1)}
                  onMinus={() => setValue(parseInt(field.value) - 1)}
                  onChange={(event) => {
                    const newValue = Number(event.currentTarget.value);
                    setValue(!isNaN(newValue) ? newValue : 6);
                  }}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("smsResendDelay")}
          labelIcon={
            <HelpItem
              helpText={t("smsResendDelayHelpText")}
              fieldLabelId="smsResendDelay"
            />
          }
          fieldId="attributes.smsResendDelay"
        >
          <Controller
            name="attributes.smsResendDelay"
            defaultValue={30}
            control={control}
            rules={{ min: 0, max: 120 }}
            render={({ field }) => {
              const MIN_VALUE = 0;
              const setValue = (newValue: number) =>
                field.onChange(Math.max(newValue, MIN_VALUE));

              return (
                <NumberInput
                  id="resendDelay"
                  value={field.value}
                  min={MIN_VALUE}
                  onPlus={() => setValue(parseInt(field.value) + 1)}
                  onMinus={() => setValue(parseInt(field.value) - 1)}
                  onChange={(event) => {
                    const newValue = Number(event.currentTarget.value);
                    setValue(!isNaN(newValue) ? newValue : 30);
                  }}
                />
              );
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("smsResendMaxRetries")}
          labelIcon={
            <HelpItem
              helpText={t("smsResendMaxRetriesHelpText")}
              fieldLabelId="smsResendMaxRetries"
            />
          }
          fieldId="attributes.smsResendMaxRetries"
        >
          <Controller
            name="attributes.smsResendMaxRetries"
            defaultValue={3}
            control={control}
            rules={{ min: 0, max: 120 }}
            render={({ field }) => {
              const MIN_VALUE = 0;
              const setValue = (newValue: number) =>
                field.onChange(Math.max(newValue, MIN_VALUE));

              return (
                <NumberInput
                  id="resendMaxRetries"
                  value={field.value}
                  min={MIN_VALUE}
                  onPlus={() => setValue(parseInt(field.value) + 1)}
                  onMinus={() => setValue(parseInt(field.value) - 1)}
                  onChange={(event) => {
                    const newValue = Number(event.currentTarget.value);
                    setValue(!isNaN(newValue) ? newValue : 3);
                  }}
                />
              );
            }}
          />
        </FormGroup>

        <Accordion asDefinitionList={false}>
          <AccordionItem>
            <AccordionToggle
              onClick={() => toggleAccordion("smsat-toggle")}
              isExpanded={expanded.includes("smsat-toggle")}
              id="smsat-toggle"
            >
              {t("smsatTitle")}
            </AccordionToggle>
            <AccordionContent
              id="smsat-exp"
              isHidden={!expanded.includes("smsat-toggle")}
            >
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("smsatProviderUrlHelpText")}
                    fieldLabelId="smsatProviderUrl"
                  />
                }
                label={t("smsatProviderUrl")}
                fieldId="attributes.smsatProviderUrl"
              >
                <TextInput
                  {...register("attributes.smsatProviderUrl")}
                  type="text"
                  id="smsatProviderUrl"
                  name="attributes.smsatProviderUrl"
                />
              </FormGroup>
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("smsatSenderAddressHelpText")}
                    fieldLabelId="smsatSenderAddress"
                  />
                }
                label={t("smsatSenderAddress")}
                fieldId="attributes.smsatSenderAddress"
              >
                <TextInput
                  {...register("attributes.smsatSenderAddress")}
                  type="text"
                  id="smsatSenderAddress"
                  name="attributes.smsatSenderAddress"
                  validated={ValidatedOptions.default}
                />
              </FormGroup>
              <FormGroup
                label={t("smsatSenderAddressTypeTitle")}
                labelIcon={
                  <HelpItem
                    helpText={t(`smsatSenderAddressTypeHelpText`)}
                    fieldLabelId={`smsatSenderAddressTypeTitle`}
                  />
                }
                fieldId="attributes.smsatSenderAddressType"
              >
                <Controller
                  name="attributes.smsatSenderAddressType"
                  defaultValue={SENDER_ADDRESS_TYPES[0].key}
                  control={control}
                  render={({ field }) => (
                    <KeycloakSelect
                      toggleId="attributes.smsatSenderAddressType"
                      onToggle={toggleSenderAddressType}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue.toString());
                        toggleSenderAddressType();
                      }}
                      selections={field.value}
                      variant={SelectVariant.single}
                      aria-label={t("smsatSenderAddressTypeTitle")}
                      // typeAheadAriaLabel={t("smsatSenderAddressTypeTitle")}
                      isOpen={openSenderAddressType}
                    >
                      {SENDER_ADDRESS_TYPES.map((option) => (
                        <SelectOption
                          selected={option.key === field.value}
                          key={option.key}
                          value={option.key}
                        >
                          {option.title}
                        </SelectOption>
                      ))}
                    </KeycloakSelect>
                  )}
                />
              </FormGroup>
              <FormGroup
                label={t("smsatAuthMethodTitle")}
                labelIcon={
                  <HelpItem
                    helpText={t(`smsatAuthMethodHelpText`)}
                    fieldLabelId={`smsatAuthMethodTitle`}
                  />
                }
                fieldId="attributes.smsatAuthMethod"
              >
                <Controller
                  name="attributes.smsatAuthMethod"
                  defaultValue={AUTH_METHOD[0].key}
                  control={control}
                  render={({ field }) => (
                    <KeycloakSelect
                      toggleId="attributes.smsatAuthMethod"
                      onToggle={toggleAuthMethod}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue.toString());
                        toggleAuthMethod();
                        setSmsAuthMethod(selectedValue.toString());
                      }}
                      selections={field.value}
                      variant={SelectVariant.single}
                      aria-label={t("smsatAuthMethodTitle")}
                      // typeAheadAriaLabel={t("smsatAuthMethodTitle")}
                      isOpen={openAuthMethod}
                    >
                      {AUTH_METHOD.map((option) => (
                        <SelectOption
                          selected={option.key === field.value}
                          key={option.key}
                          value={option.key}
                        >
                          {option.title}
                        </SelectOption>
                      ))}
                    </KeycloakSelect>
                  )}
                />
              </FormGroup>
              <div hidden={smsatAuthMethod !== "token"}>
                <FormGroup
                  labelIcon={
                    <HelpItem
                      helpText={t("smsatApiTokenHelpText")}
                      fieldLabelId="smsatApiToken"
                    />
                  }
                  label={t("smsatApiToken")}
                  fieldId="attributes.smsatApiToken"
                >
                  <TextInput
                    {...register("attributes.smsatApiToken")}
                    type="password"
                    id="smsatApiToken"
                    name="attributes.smsatApiToken"
                    validated={ValidatedOptions.default}
                  />
                </FormGroup>
              </div>
              <div hidden={smsatAuthMethod !== "basic"}>
                <FormGroup
                  labelIcon={
                    <HelpItem
                      helpText={t("smsatUsernameHelpText")}
                      fieldLabelId="smsatUsername"
                    />
                  }
                  label={t("smsatUsername")}
                  fieldId="attributes.smsatUsername"
                >
                  <TextInput
                    {...register("attributes.smsatUsername")}
                    type="text"
                    id="username"
                    name="attributes.smsatUsername"
                    validated={ValidatedOptions.default}
                  />
                </FormGroup>
                <FormGroup
                  labelIcon={
                    <HelpItem
                      helpText={t("smsatPasswordHelpText")}
                      fieldLabelId="smsatPassword"
                    />
                  }
                  label={t("smsatPassword")}
                  fieldId="attributes.smsatPassword"
                >
                  <TextInput
                    {...register("attributes.smsatPassword")}
                    type="password"
                    id="smsatPassword"
                    name="attributes.smsatPassword"
                    validated={ValidatedOptions.default}
                  />
                </FormGroup>
              </div>
              <FormGroup
                label={t("smsatConnectTimeout")}
                labelIcon={
                  <HelpItem
                    helpText={t("smsatConnectTimeoutHelpText")}
                    fieldLabelId="smsatConnectTimeout"
                  />
                }
                fieldId="attributes.smsatConnectTimeout"
              >
                <Controller
                  name="attributes.smsatConnectTimeout"
                  defaultValue={0}
                  control={control}
                  rules={{ min: 0, max: 120 }}
                  render={({ field }) => {
                    const MIN_VALUE = 0;
                    const setValue = (newValue: number) =>
                      field.onChange(Math.max(newValue, MIN_VALUE));

                    return (
                      <NumberInput
                        id="smsatConnectTimeout"
                        value={field.value}
                        min={MIN_VALUE}
                        onPlus={() => setValue(parseInt(field.value) + 1)}
                        onMinus={() => setValue(parseInt(field.value) - 1)}
                        onChange={(event) => {
                          const newValue = Number(event.currentTarget.value);
                          setValue(!isNaN(newValue) ? newValue : 0);
                        }}
                        validated={ValidatedOptions.default}
                      />
                    );
                  }}
                />
              </FormGroup>
              <FormGroup
                label={t("smsatReadTimeout")}
                labelIcon={
                  <HelpItem
                    helpText={t("smsatReadTimeoutHelpText")}
                    fieldLabelId="smsatReadTimeout"
                  />
                }
                fieldId="attributes.smsatReadTimeout"
              >
                <Controller
                  name="attributes.smsatReadTimeout"
                  defaultValue={0}
                  control={control}
                  rules={{ min: 0, max: 120 }}
                  render={({ field }) => {
                    const MIN_VALUE = 0;
                    const setValue = (newValue: number) =>
                      field.onChange(Math.max(newValue, MIN_VALUE));

                    return (
                      <NumberInput
                        id="smsatReadTimeout"
                        value={field.value}
                        min={MIN_VALUE}
                        onPlus={() => setValue(parseInt(field.value) + 1)}
                        onMinus={() => setValue(parseInt(field.value) - 1)}
                        onChange={(event) => {
                          const newValue = Number(event.currentTarget.value);
                          setValue(!isNaN(newValue) ? newValue : 0);
                        }}
                      />
                    );
                  }}
                />
              </FormGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionToggle
              onClick={() => toggleAccordion("nexmo-toggle")}
              isExpanded={expanded.includes("nexmo-toggle")}
              id="nexmo-toggle"
            >
              {t("nexmoTitle")}
            </AccordionToggle>
            <AccordionContent
              id="nexmo-exp"
              isHidden={!expanded.includes("nexmo-toggle")}
            >
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoProviderUrlHelpText")}
                    fieldLabelId="nexmoProviderUrl"
                  />
                }
                label={t("nexmoProviderUrl")}
                fieldId="attributes.nexmoProviderUrl"
              >
                <TextInput
                  {...register("attributes.nexmoProviderUrl")}
                  type="text"
                  id="nexmoProviderUrl"
                  name="attributes.nexmoProviderUrl"
                  validated={ValidatedOptions.default}
                />
              </FormGroup>
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoSenderIdHelpText")}
                    fieldLabelId="nexmoSenderId"
                  />
                }
                label={t("nexmoSenderId")}
                fieldId="attributes.nexmoSenderId"
              >
                <TextInput
                  {...register("attributes.nexmoSenderId")}
                  type="text"
                  id="nexmoSenderId"
                  name="attributes.nexmoSenderId"
                  validated={ValidatedOptions.default}
                />
              </FormGroup>
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoApiKeyHelpText")}
                    fieldLabelId="nexmoApiKey"
                  />
                }
                label={t("nexmoApiKey")}
                fieldId="attributes.nexmoApiKey"
              >
                <TextInput
                  {...register("attributes.nexmoApiKey")}
                  type="password"
                  id="nexmoApiKey"
                  name="attributes.nexmoApiKey"
                  validated={ValidatedOptions.default}
                />
              </FormGroup>
              <FormGroup
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoApiSecretHelpText")}
                    fieldLabelId="nexmoApiSecret"
                  />
                }
                label={t("nexmoApiSecret")}
                fieldId="attributes.nexmoApiSecret"
              >
                <TextInput
                  {...register("attributes.nexmoApiSecret")}
                  type="password"
                  id="nexmoApiSecret"
                  name="attributes.nexmoApiSecret"
                  validated={ValidatedOptions.default}
                />
              </FormGroup>
              <FormGroup
                label={t("nexmoConnectTimeout")}
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoConnectTimeoutHelpText")}
                    fieldLabelId="nexmoConnectTimeout"
                  />
                }
                fieldId="attributes.nexmoConnectTimeout"
              >
                <Controller
                  name="attributes.nexmoConnectTimeout"
                  defaultValue={0}
                  control={control}
                  rules={{ min: 0, max: 120 }}
                  render={({ field }) => {
                    const MIN_VALUE = 0;
                    const setValue = (newValue: number) =>
                      field.onChange(Math.max(newValue, MIN_VALUE));

                    return (
                      <NumberInput
                        id="nexmoConnectTimeout"
                        value={field.value}
                        min={MIN_VALUE}
                        onPlus={() => setValue(parseInt(field.value) + 1)}
                        onMinus={() => setValue(parseInt(field.value) - 1)}
                        onChange={(event) => {
                          const newValue = Number(event.currentTarget.value);
                          setValue(!isNaN(newValue) ? newValue : 0);
                        }}
                      />
                    );
                  }}
                />
              </FormGroup>
              <FormGroup
                label={t("nexmoReadTimeout")}
                labelIcon={
                  <HelpItem
                    helpText={t("nexmoReadTimeoutHelpText")}
                    fieldLabelId="nexmoReadTimeout"
                  />
                }
                fieldId="attributes.nexmoReadTimeout"
              >
                <Controller
                  name="attributes.nexmoReadTimeout"
                  defaultValue={0}
                  control={control}
                  rules={{ min: 0, max: 120 }}
                  render={({ field }) => {
                    const MIN_VALUE = 0;
                    const setValue = (newValue: number) =>
                      field.onChange(Math.max(newValue, MIN_VALUE));

                    return (
                      <NumberInput
                        id="nexmoReadTimeout"
                        value={field.value}
                        min={MIN_VALUE}
                        onPlus={() => setValue(parseInt(field.value) + 1)}
                        onMinus={() => setValue(parseInt(field.value) - 1)}
                        onChange={(event) => {
                          const newValue = Number(event.currentTarget.value);
                          setValue(!isNaN(newValue) ? newValue : 0);
                        }}
                        validated={ValidatedOptions.default}
                      />
                    );
                  }}
                />
              </FormGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            type="submit"
            isDisabled={!isDirty}
          >
            {t("save")}
          </Button>
          <Button
            data-testid="reload"
            variant={ButtonVariant.link}
            onClick={() => setupForm(realm)}
          >
            {t("reload")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
