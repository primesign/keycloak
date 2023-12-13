import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generatePath } from "react-router-dom";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderIdgParams = { realm: string };

const AddIdgConnect = lazy(() => import("../add/AddIdgConnect"));

export const IdentityProviderIdgRoute: AppRouteObject = {
  path: "/:realm/identity-providers/german-eid/add",
  element: <AddIdgConnect />,
  breadcrumb: (t) => t("addIdgProvider"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderIdg = (
  params: IdentityProviderIdgParams,
): Partial<Path> => ({
  pathname: generatePath(IdentityProviderIdgRoute.path, params),
});
