import {PrivateAuthenticationStore} from "@containers/app/interface";
import {AuthenticationContext} from "@containers/authentication";
import {useContext} from "react";

const useAuthentication = () => {
  return useContext(AuthenticationContext) as PrivateAuthenticationStore;
};

export default useAuthentication;
