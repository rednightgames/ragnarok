import {getItem} from "../helpers/storage";
import {PersistedSession} from "./sessionInterface";

const STORAGE_PREFIX = "ps-";
const getKey = (localID: number) => `${STORAGE_PREFIX}${localID}`;

export const getPersistedSession = (
  localID: number,
): PersistedSession | undefined => {
  const itemValue = getItem(getKey(localID));
  if (!itemValue) {
    return;
  }
  try {
    const parsedValue = JSON.parse(itemValue);
    return {
      UserID: parsedValue.UserID || "",
      UID: parsedValue.UID || "",
      blob: parsedValue.blob || "",
      persistent:
        typeof parsedValue.persistent === "boolean"
          ? parsedValue.persistent
          : true,
      trusted: parsedValue.trusted || false,
      payloadVersion: parsedValue.payloadVersion || 1,
    };
  } catch (e: any) {
    return undefined;
  }
};
