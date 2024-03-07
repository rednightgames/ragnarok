import {Ref, useCallback} from "react";

const useCombinedRefs = <T extends any>(
  ...refs: (Ref<T> | undefined)[]
): Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        if (typeof ref === "function") {
          return ref(element);
        }

        (ref as any).current = element;
      }),
    refs,
  );

export default useCombinedRefs;
