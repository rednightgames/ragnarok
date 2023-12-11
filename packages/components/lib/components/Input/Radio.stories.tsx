import {Meta} from "@storybook/react";
import {useState} from "react";

import RadioGroup from "./RadioGroup";

export default {
  component: RadioGroup,
  title: "components/Radio",
} as Meta<typeof RadioGroup>;

const themes = ["Dark", "Light", "Auto"] as const;

export const Basic = () => {
  const [selectedColor, setSelectedColor] = useState<(typeof themes)[number] | undefined>(undefined);

  return (
    <div>
      <RadioGroup
        name="selected-themes"
        onChange={(v) => setSelectedColor(v)}
        value={selectedColor}
        options={themes.map((option) => ({value: option, label: option}))}
      />
    </div>
  );
};
