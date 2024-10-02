import {FormGroup, TextInput, ValidatedOptions} from "@patternfly/react-core";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {HelpItem, TextControl} from "@keycloak/keycloak-ui-shared";
import { DisplayOrder } from "../component/DisplayOrder";
import { RedirectUrl } from "../component/RedirectUrl";
import { TextField } from "../component/TextField";
import type { IdentityProviderParams } from "../routes/IdentityProvider";

export const IdgGeneralSettings = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { tab } = useParams<IdentityProviderParams>();

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <RedirectUrl id={id} />

      <TextControl
       name="alias"
       label={t("alias")}
       labelIcon={t("aliasHelp")}
       rules={{
           required: t("required"),
       }}
       readOnly={tab === "settings"}
       />

      <TextField field="displayName" label="displayName" />
      <DisplayOrder />
    </>
  );
};
