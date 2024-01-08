import config from "./config";
import {Button, Icon, RednightApp} from "@rednight/components";

const App = () => {
  return (
    <RednightApp config={config}>
      <Button>Link</Button>
      <Icon size={110} name="account" />
    </RednightApp>
  );
};

export default App;
