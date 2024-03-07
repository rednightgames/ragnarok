import {AuthenticationStore} from "@rednight/shared";

export type PrivateAuthenticationStore = AuthenticationStore & {
  UID: string;
};
