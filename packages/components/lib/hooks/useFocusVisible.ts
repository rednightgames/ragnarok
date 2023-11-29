import {FocusContext} from "@containers/focus";
import {useContext, useEffect, useState} from "react";

export const useFocusVisible = () => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [isFocusVisible, setFocusVisible] = useState<boolean>(false);
  const hadKeyboardEvent = useContext(FocusContext);

  const onInput = () => {
    if (!isFocusVisible) {
      setFocusVisible(false);
      setFocused(false);
    }
  };

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  useEffect(() => {
    setFocusVisible(hadKeyboardEvent && isFocused);
  }, [hadKeyboardEvent, isFocused]);

  return {
    focusVisible: isFocusVisible,
    onInput,
    onFocus,
    onBlur,
  };
};
