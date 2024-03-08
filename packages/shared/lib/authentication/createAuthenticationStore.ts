/* eslint-disable ts/no-unused-vars */

interface Arguments {
  initialAuth?: boolean;
  store: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
  };
  onUID?: (UID: string | undefined) => void;
}

const createAuthenticationStore = ({
  initialAuth,
  store: {set, get},
  onUID,
}: Arguments) => {};

export type AuthenticationStore = ReturnType<typeof createAuthenticationStore>;

export default createAuthenticationStore;
