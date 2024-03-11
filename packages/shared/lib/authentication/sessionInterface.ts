export interface PersistedSessionBlob {
  keyPassword: string;
}

export interface PersistedSession {
  UserID: string;
  UID: string;
  persistent: boolean;
  trusted: boolean;
  payloadVersion: 1;
}

export interface PersistedSessionWithLocalID extends PersistedSession {
  localID: number;
}
