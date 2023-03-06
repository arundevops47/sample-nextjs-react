import dynamic from "next/dynamic";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from "@utils/auth-utils";
import { ADMIN, STORE_OWNER } from "@utils/constants";
import { ROUTES } from "@utils/routes";
import AppLayout from "@components/layouts/app";
const AdminDashboard = dynamic(() => import("@components/dashboard/admin"));
const StoreOwnerDashboard = dynamic(() => import("@components/dashboard/store-owner"));
const OwnerDashboard = dynamic(() => import("@components/dashboard/owner"));

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(ADMIN)) {
    return <AdminDashboard />;
  }
	else if(userPermissions?.includes(STORE_OWNER)) {
		return <StoreOwnerDashboard />;
	}	
  return <OwnerDashboard />;
}

Dashboard.Layout = AppLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const { token, permissions } = getAuthCredentials(ctx);
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: ROUTES.LOGIN,
        permanent: false,
      },
    };
  }
	
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          "common",
          "table",
          "widgets",
        ])),
        userPermissions: permissions,
      },
    };
  }
	
  return {
    props: {
      userPermissions: permissions,
    },
  };
};
