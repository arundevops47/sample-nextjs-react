import { adminAndStoreOwnerOnly } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";

export const siteSettings = {
  name: "Ecommerce",
  description: "",
  logo: {
    url: "/logo.svg",
    alt: "Ecommerce",
    href: "/",
    width: 128,
    height: 40,
  },
  defaultLanguage: "en",
  author: {
    name: "Ecommerce, Inc.",
    websiteUrl: "#",
    address: "",
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: ROUTES.PROFILE_UPDATE,
      labelTransKey: "authorized-nav-item-profile",
    },
    {
      href: ROUTES.LOGOUT,
      labelTransKey: "authorized-nav-item-logout",
    },
  ],
  currencyCode: "USD",
  sidebarLinks: {
    admin: [
      {
        href: ROUTES.DASHBOARD,
        label: "sidebar-nav-item-dashboard",
        icon: "DashboardIcon",
      },
      {
        href: ROUTES.USERS,
        label: "sidebar-nav-item-users",
        icon: "UsersIcon",
      },								
      {
        href: ROUTES.STORES,
        label: "sidebar-nav-item-stores",
        icon: "StoreIcon",
      },
      {
        href: ROUTES.SETTINGS,
        label: "sidebar-nav-item-settings",
        icon: "SettingsIcon",
      },
    ],
    store: [
      {
        href: (store: string) => `${ROUTES.DASHBOARD}`,
        label: "sidebar-nav-item-dashboard",
        icon: "DashboardIcon",
        permissions: adminAndStoreOwnerOnly,
      },
      {
        href: (store: string) => `${ROUTES.STORES}`,
        label: "sidebar-nav-item-stores",
        icon: "StoreIcon",
        permissions: adminAndStoreOwnerOnly,
      },		
    ],
  },
  product: {
    placeholder: "/product-placeholder.svg",
  },
  avatar: {
    placeholder: "/avatar-placeholder.svg",
  },
};
