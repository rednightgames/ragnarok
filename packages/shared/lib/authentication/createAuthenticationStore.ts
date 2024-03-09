import {stripLeadingAndTrailingSlash} from "@rednight/utils";

import {SSO_PATHS} from "../constants";
import {
  getBasename,
  getLocalIDFromPathname,
  stripLocalBasenameFromPathname,
} from "./pathnameHelper";
import {getPersistedSession} from "./persistedSessionStorage";

const UID_KEY = "rednight:oauth:UID";
const LOCAL_ID_KEY = "rednight:localID";
const PERSIST_SESSION_KEY = "rednight:persistSession";
const TRUST_SESSION_KEY = "rednight:trustSession";
const CLIENT_KEY_KEY = "rednight:clientKey";

const getIsSSOPath = (pathname: string) => {
  const strippedPathname = `/${stripLeadingAndTrailingSlash(pathname)}`;
  return Object.values(SSO_PATHS).some((path) =>
    strippedPathname.startsWith(path),
  );
};

export const getSafePath = (url: string) => {
  try {
    const {pathname, hash, search} = new URL(url, window.location.origin);
    if (getIsSSOPath(pathname)) {
      return "";
    }
    return `${stripLeadingAndTrailingSlash(stripLocalBasenameFromPathname(pathname))}${search}${hash}`;
  } catch (e: any) {
    return "";
  }
};

const getPath = (
  basename: string | undefined,
  oldUrl: string,
  requestedPath?: string,
) => {
  return [
    basename || "",
    `/${getSafePath(requestedPath || "/") || getSafePath(oldUrl)}`,
  ].join("");
};

interface AuthData {
  UID: string | undefined;
  localID: number | undefined;
  basename: string | undefined;
}

const defaultAuthData = {
  UID: undefined,
  localID: undefined,
  basename: undefined,
};

const getInitialState = (oldUID?: string, oldLocalID?: number): AuthData => {
  const {pathname} = window.location;
  if (getIsSSOPath(pathname)) {
    return defaultAuthData;
  }
  const localID = getLocalIDFromPathname(pathname);
  if (localID === undefined) {
    return defaultAuthData;
  }
  const persistedSession = getPersistedSession(localID);
  if (
    persistedSession &&
    (oldUID === undefined ||
      (persistedSession.UID === oldUID && localID === oldLocalID))
  ) {
    return {
      UID: persistedSession.UID,
      localID,
      basename: getBasename(localID),
    };
  }
  return defaultAuthData;
};

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
}: Arguments) => {
  const setUID = (UID: string | undefined) => {
    set(UID_KEY, UID);
    onUID?.(UID);
  };
  const getUID = (): string => get(UID_KEY);

  const getLocalID = () => get(LOCAL_ID_KEY);

  const setLocalID = (LocalID: number | undefined) => {
    set(LOCAL_ID_KEY, LocalID);
  };

  const hasSession = () => !!getUID();

  const setPersistent = (persist: boolean | undefined) =>
    set(PERSIST_SESSION_KEY, persist);
  const getPersistent = () => get(PERSIST_SESSION_KEY) ?? undefined;

  const setClientKey = (clientKey: string | undefined) =>
    set(CLIENT_KEY_KEY, clientKey);
  const getClientKey = () => get(CLIENT_KEY_KEY) ?? undefined;

  const setTrusted = (trusted: boolean | undefined) =>
    set(TRUST_SESSION_KEY, trusted);
  const getTrusted = () => get(TRUST_SESSION_KEY) ?? false;

  const initialUID = getUID();
  let initialAuthData: AuthData =
    initialAuth === false
      ? defaultAuthData
      : getInitialState(initialUID, getLocalID());
  let basename = initialAuthData.basename;

  setUID(initialAuthData?.UID);

  const login = ({
    UID: newUID,
    LocalID: newLocalID,
    persistent,
    trusted,
    path,
    clientKey,
  }: {
    UID: string;
    LocalID: number;
    persistent: boolean;
    trusted: boolean;
    path?: string;
    clientKey: string;
  }) => {
    setUID(newUID);
    setPersistent(persistent);
    setTrusted(trusted);
    setClientKey(clientKey);

    if (newLocalID !== undefined) {
      setLocalID(newLocalID);
      basename = getBasename(newLocalID);
    } else {
      setLocalID(undefined);
      basename = undefined;
    }

    return getPath(basename, window.location.href, path);
  };

  const logout = () => {
    setUID(undefined);
    setPersistent(undefined);
    setLocalID(undefined);
    setTrusted(undefined);
    setClientKey(undefined);
    basename = undefined;
  };

  return {
    getUID,
    setUID,
    setLocalID,
    getLocalID,
    hasSession,
    setPersistent,
    getPersistent,
    setClientKey,
    getClientKey,
    setTrusted,
    getTrusted,
    logout,
    login,
    get UID() {
      return getUID();
    },
    get localID() {
      return getLocalID();
    },
    get basename() {
      return basename;
    },
    get ready(): boolean {
      return Boolean(initialAuthData.UID && initialUID);
    },
  };
};

export type AuthenticationStore = ReturnType<typeof createAuthenticationStore>;

export default createAuthenticationStore;
