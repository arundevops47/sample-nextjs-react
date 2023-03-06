import Cookies from "js-cookie";
import { ADMIN } from "./constants";

export function loggedIn() {
  const token = Cookies.get("auth_token");
  if (!token) return false;
  if (token) {
    const permissions = Cookies.get("auth_permissions");
    if (!permissions?.includes(ADMIN)) {
      return false;
    }
  }
  return true;
}
