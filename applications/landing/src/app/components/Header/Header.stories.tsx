import {Meta} from "@storybook/react";

import Header from "./Header";

export default {
  component: Header,
  title: "components/Header",
} as Meta<typeof Header>;

export const Playground = ({...args}) => <Header {...args} />;

Playground.argTypes = {};
