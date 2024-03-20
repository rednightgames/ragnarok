import {PrivateAuthenticationStore} from "@containers/app/interface";
import {AuthenticationContext} from "@containers/authentication";
import {useContext} from "react";

export const useAuthentication = () => {
  return useContext(AuthenticationContext) as PrivateAuthenticationStore;
};
