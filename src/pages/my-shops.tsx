import OwnerDashboard from "@components/dashboard/owner";
import StoreOwnerDashboard from "@components/dashboard/store-owner";
import AdminLayout from "@components/layouts/admin";
import { adminOnly } from "@utils/auth-utils";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common"])),
  },
});
const MyStoresPage = () => {
  return <StoreOwnerDashboard />;
};

MyStoresPage.authenticate = {
  permissions: adminOnly,
};
MyStoresPage.Layout = AdminLayout;
export default MyStoresPage;
