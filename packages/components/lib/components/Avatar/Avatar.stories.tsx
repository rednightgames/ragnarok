import {Meta} from "@storybook/react";

import Avatar from "./Avatar";

export default {
  component: Avatar,
  title: "components/Avatar",
} as Meta<typeof Avatar>;

export const Playground = ({
  ...args
}) => (
  <Avatar
    src="https://cdn.rednightgames.com/avatars/e8a206ef88bdd3320fc9b370dabda8839523da972c5ca9e20d5754e5243403f6.webp"
    {...args}
  />
);

Playground.argTypes = {
  size: {
    options: ["small", "medium", "large"],
    control: {
      type: "select",
      defaultValue: "medium"
    }
  }
}