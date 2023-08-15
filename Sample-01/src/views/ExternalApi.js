import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import axios from "axios";
import { getServices } from "./services";

export const ExternalApiComponent = () => {
  const auth0Context = useAuth0();
  const {
    apiOrigin = "http://localhost:3001",
    submgntAudience,
    submgntScope,
    submgntUrl,
  } = getConfig();

  const callServices = async () => {
    await getServices(auth0Context);
  };

  callServices();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    //await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    // await callApi();
  };

  const callApi = async () => {
    try {
      // let newToken = await getAccessTokenSilently({
      //   authorizationParams: {
      //     audience: submgntAudience,
      //     scope: submgntScope,
      //   },
      // });

      var options = {
        method: "POST",
        url: "https://auth.devbrandbank.com/oauth/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": window.location.origin,
        },
        data: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: "8uXj55w1HgS0XMq4Pb3HIBCnPHkve4zo",
          client_secret:
            "rvkQ5aP-xMplXNMXfMax3TybVcxQYNonYAaLIa7k3bGw656mF9gqR91yvSzgyPu1",
          audience: "subscribermanagement-api",
        }),
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
      let payload = {
        scope: "All",
      };

      //   const { response } = await axios.post(
      //     submgntUrl + "/getContactLookUpFields",
      //     payload,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //         "Ocp-Apim-Subscription-Key":
      //           process.env.REACT_APP_APIM_SUBSCRIPTION_KEY,
      //         Authorization: `bearer ${newToken}`,
      //       },
      //     }
      //   );

      //   const responseData = await response.json();

      //   setState({
      //     ...state,
      //     showResult: true,
      //     apiMessage: responseData,
      //   });
    } catch (error) {
      //   setState({
      //     ...state,
      //     error: error.error,
      //   });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>External API</h1>
        <p className="lead">
          Ping an external API by clicking the button below.
        </p>

        <p>
          This will call a local API on port 3001 that would have been started
          if you run <code>npm run dev</code>. An access token is sent as part
          of the request's `Authorization` header and the API will validate it
          using the API's audience value.
        </p>

        {true && (
          <Alert color="warning">
            <p>
              You can't call the API at the moment because your application does
              not have any configuration for <code>audience</code>, or it is
              using the default value of <code>YOUR_API_IDENTIFIER</code>. You
              might get this default value if you used the "Download Sample"
              feature of{" "}
              <a href="https://auth0.com/docs/quickstart/spa/react">
                the quickstart guide
              </a>
              , but have not set an API up in your Auth0 Tenant. You can find
              out more information on{" "}
              <a href="https://auth0.com/docs/api">setting up APIs</a> in the
              Auth0 Docs.
            </p>
            <p>
              The audience is the identifier of the API that you want to call
              (see{" "}
              <a href="https://auth0.com/docs/get-started/dashboard/tenant-settings#api-authorization-settings">
                API Authorization Settings
              </a>{" "}
              for more info).
            </p>

            <p>
              In this sample, you can configure the audience in a couple of
              ways:
            </p>
            <ul>
              <li>
                in the <code>src/index.js</code> file
              </li>
              <li>
                by specifying it in the <code>auth_config.json</code> file (see
                the <code>auth_config.json.example</code> file for an example of
                where it should go)
              </li>
            </ul>
            <p>
              Once you have configured the value for <code>audience</code>,
              please restart the app and try to use the "Ping API" button below.
            </p>
          </Alert>
        )}

        <Button
          color="primary"
          className="mt-5"
          onClick={callApi}
          //disabled={!audience}
        >
          Ping API
        </Button>
      </div>

      <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
