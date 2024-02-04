import Cookies from "js-cookie";

const getTokenClient = (admin = false, throwError = true) => {
  const token = Cookies.get(admin ? "tokenAdmin" : "tokenUser") || "";

  return token ? JSON.parse(token) : "";
};
export default getTokenClient;
