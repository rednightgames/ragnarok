import {Meta} from "@storybook/react";

import Checkbox from "./Checkbox";

export default {
  component: Checkbox,
  title: "components/Checkbox",
} as Meta<typeof Checkbox>;

export const Basic = () => {
  return (
    <div>
      <div className="my-4">
        <Checkbox>checkbox</Checkbox>
      </div>
      <div className="my-4">
        <Checkbox checked>
          checked
        </Checkbox>
      </div>
      <div className="my-4">
        <Checkbox
          checked
          disabled
        >
          checked disabled
        </Checkbox>
      </div>
    </div>
  );
};
