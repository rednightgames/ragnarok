import {Button, Header, Icon, RednightApp} from "@rednight/components";

import config from "./config";

const App = () => {
  return (
    <RednightApp config={config}>
      <Header />
      <Button>Link</Button>
      <Icon size={110} name="account" />
    </RednightApp>
  );
};

export default App;
