import {createContext} from "react";

import {PrivateAuthenticationStore} from "../app/interface";

export default createContext<PrivateAuthenticationStore>(null as any);
