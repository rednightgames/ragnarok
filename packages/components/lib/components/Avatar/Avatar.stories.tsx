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
    {...args}
    src="https://cdn.rednightgames.com/avatars/056b798d3db2fbfb230b357d4028be97e5fd3b84a7697b10c4354c11c95a59aa.webp"
  />
);

Playground.argTypes = {
  size: {
    options: ["small", "medium", "large"],
    control: {
      type: "select",
      defaultValue: "medium",
    },
  },
  fallback: {
    control: "text",
  },
};
