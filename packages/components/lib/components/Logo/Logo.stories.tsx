import {Meta} from "@storybook/react";

import Logo from "./Logo";

export default {
  component: Logo,
  title: "components/Logo",
} as Meta<typeof Logo>;

export const Playground = ({...args}) => <Logo as="button" {...args} />;

Playground.argTypes = {
  sublogo: {
    options: ["default", "account", "console"],
    control: {
      type: "select",
      defaultValue: "default",
    },
  },
};
