import { ADMIN, STORE_OWNER } from "@utils/constants";
import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("@components/layouts/admin"));
const OwnerLayout = dynamic(() => import("@components/layouts/owner"));
const StoreOwnerLayout = dynamic(() => import("@components/layouts/store-owner"));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(ADMIN)) {
    return <AdminLayout {...props} />;
  }
	else if(userPermissions?.includes(STORE_OWNER)) {
		return <StoreOwnerLayout {...props} />;
	}
  return <OwnerLayout {...props} />;
}
