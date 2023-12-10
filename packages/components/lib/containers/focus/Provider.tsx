import {FC, ReactNode, useEffect, useState} from "react";

import FocusContext from "./focusContext";

const EventTypes = [
  "mousemove",
  "mousedown",
  "mouseup",
  "pointermove",
  "pointerdown",
  "pointerup",
  "touchmove",
  "touchstart",
  "touchend",
];

interface FocusProps {
  children: ReactNode;
}

const FocusProvider: FC<FocusProps> = ({children}) => {
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState<boolean>(true);

  useEffect(() => {
    const onPointerDown = () => {
      setHadKeyboardEvent(false);
    };

    const onInitialPointerMove = (e: Event) => {
      const t: HTMLElement = e.target as HTMLElement;

      if (t.nodeName && t.nodeName.toLowerCase() === "html") {
        return;
      }

      setHadKeyboardEvent(false);
      EventTypes.map(type => {
        document.removeEventListener(type, onInitialPointerMove);
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") {
        return;
      }

      setHadKeyboardEvent(true);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setHadKeyboardEvent(true);
        EventTypes.map(type => {
          document.addEventListener(type, onInitialPointerMove);
        });
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("visibilitychange", onVisibilityChange, true);

    EventTypes.map(type => {
      document.addEventListener(type, onInitialPointerMove);
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
        true,
      );

      EventTypes.map(type => {
        document.removeEventListener(type, onInitialPointerMove);
      });
    };
  }, [setHadKeyboardEvent]);

  return (
    <FocusContext.Provider value={hadKeyboardEvent}>
      {children}
    </FocusContext.Provider>
  );
};

export default FocusProvider;
