import {AuthenticationStore} from "@rednight/shared";

export interface PrivateAuthenticationStore extends AuthenticationStore {
  UID: string;
}
