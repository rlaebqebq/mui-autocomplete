import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TPosition } from "./position.d";
import { TOption } from "./option.d";

const useDropdownPosition = ({
  selectRef,
  isOptionListOpen,
  options,
}: {
  selectRef: RefObject<HTMLDivElement | null>;
  isOptionListOpen: boolean;
  options: TOption[];
}): {
  optionListPosition:
    | { position: TPosition; topY: number; rectHeight: number }
    | undefined;
  optionListRef: MutableRefObject<HTMLUListElement | null>;
} => {
  const optionListRef = useRef<HTMLUListElement | null>(null);

  const [optionListPosition, setDropdownPosition] = useState<{
    position: TPosition;
    topY: number;
    rectHeight: number;
  }>();

  const calculateDropdown = useCallback(() => {
    const select = selectRef.current;
    const optionList = optionListRef.current;

    if (!isOptionListOpen) return;
    if (!select || !optionList) {
      setDropdownPosition(undefined);
      return;
    }

    optionList.style.maxHeight = "40vh";

    const optionListRectHeight = optionList.getBoundingClientRect().height;
    const selectRect = select.getBoundingClientRect();
    const spaceAbove = selectRect.top;
    const spaceBelow = window.innerHeight - selectRect.bottom;

    let position: TPosition = optionListPosition?.position ?? "bottom";
    let topY = 0;
    let rectHeight = optionListRectHeight;

    const maxHeight = (40 * window.innerHeight) / 100;
    if (rectHeight > maxHeight) {
      rectHeight = maxHeight;
    }

    if (rectHeight <= spaceBelow && rectHeight <= spaceAbove) {
      position = "bottom";
      topY = 0;
    } else if (rectHeight <= spaceAbove) {
      position = "top";
      topY = rectHeight;
    } else if (rectHeight <= spaceBelow) {
      position = "bottom";
      topY = 0;
    }

    setDropdownPosition((prev) => {
      if (
        !prev ||
        prev.position !== position ||
        prev.topY !== topY ||
        prev.rectHeight !== rectHeight
      ) {
        return { position, topY, rectHeight };
      }
      return prev;
    });
  }, [isOptionListOpen, selectRef, optionListRef, optionListPosition]);

  useEffect(() => {
    window.addEventListener("resize", calculateDropdown);
    window.addEventListener("scroll", calculateDropdown);

    return () => {
      window.removeEventListener("resize", calculateDropdown);
      window.removeEventListener("scroll", calculateDropdown);
    };
  }, [calculateDropdown]);

  useEffect(() => {
    calculateDropdown();
  }, [isOptionListOpen, options, calculateDropdown]);

  return { optionListPosition, optionListRef };
};

export default useDropdownPosition;
