import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "./config";

const AuthLogin = () => {
  const { loginWithRedirect } = useAuth0();
  const config = getConfig();

  loginWithRedirect({
    authorizationParams: {
      redirectUri: window.location.origin,
      connection: config.connection,
      // audience: config.audience,
      // scope: "openid profile email offline_access read:getServices",
    },
    appState: {
      returnTo: window.location.pathname,
    },
  });

  return <div>loading...</div>;
};

export default AuthLogin;
