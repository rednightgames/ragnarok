import {Meta} from "@storybook/react";
import Avatar from "./Avatar";

export default {
  component: Avatar,
  title: "components/Avatar",
} as Meta<typeof Avatar>;

export const Basic = () => (
  <Avatar src="https://cdn.rednightgames.com/banners/15e776a7618b9d559f747ef07427a8bf30888eab2ff4aaab488ed2715f999954.webp" />
);
