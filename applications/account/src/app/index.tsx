import {createRoot} from "react-dom/client";
import App from "./app";

import "./app.scss";

createRoot(document.getElementById("app")!).render(<App />);
