import {Header} from "@components";
import {RednightApp} from "@rednight/components";

import config from "./config";

const App = () => {
  return (
    <RednightApp config={config}>
      <Header />
    </RednightApp>
  );
};

export default App;
