import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getServices = async (authContext) => {
  let newToken = await getAccessToken(authContext);
  let payload = {
    email: "anulekha.karangatte@brandbank.com",
    services: "WS-CONNECT+,IC3D-SC,BB-PL,PC-BBG,PC-CORE,PC-SDE",
  };

  const { data } = await axios.post(
    "https://api.devbrandbank.com/userapi/getServices",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": "40c68b0516a94c6d8ae716907746d921",
        Authorization: `bearer ${newToken}`,
      },
    }
  );

  return data;
};

export const getAccessToken = async (
  authContext,
  audience = "user-api",
  scope = "read:getServices"
) => {
  try {
    const { getAccessTokenSilently } = authContext;
    let token = await getAccessTokenSilently({
      authorizationParams: {
        audience: audience,
        scope: scope,
      },
    });
    console.log(token);
    console.log(audience);
    console.log(scope);
    return token;
  } catch (e) {
    console.log("Invalid Access Token ", e);
  }
};
