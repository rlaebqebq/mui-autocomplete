import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { TOption } from "./option.d";

const useDropdownKeyHandler = ({
  selectRef,
  optionListRef,
  isOptionListOpen,
  optionCursor,
  setOptionCursor,
  isMouseNavigate,
  setIsMouseNavigate,
  options,
  onChange,
  handleOptionListOpen,
  handleOptionListClose,
}: {
  selectRef: MutableRefObject<HTMLDivElement | null>;
  optionListRef: MutableRefObject<HTMLUListElement | null>;
  isOptionListOpen: boolean;
  optionCursor: number;
  setOptionCursor: Dispatch<SetStateAction<number>>;
  isMouseNavigate: boolean;
  setIsMouseNavigate: Dispatch<SetStateAction<boolean>>;
  options: TOption[];
  onChange: (option: TOption | undefined) => void;
  handleOptionListOpen: () => void;
  handleOptionListClose: () => void;
}): { optionButtonsRef: MutableRefObject<HTMLButtonElement[] | null[]> } => {
  const [isKeyboardNavigate, setIsKeyboardNavigate] = useState<boolean>(false);

  const optionButtonsRef = useRef<HTMLButtonElement[] | null[]>([]);

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      const select = selectRef?.current;
      if (!select || !select.contains(e.target as Node)) return;

      if (e.isComposing) return;

      const size = options.length;

      if (isOptionListOpen) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            setIsKeyboardNavigate(true);
            setOptionCursor((prev) => (prev - 1 < 0 ? size - 1 : prev - 1));
            break;
          case "ArrowDown":
            e.preventDefault();
            setIsKeyboardNavigate(true);
            setOptionCursor((prev) => (prev < size - 1 ? prev + 1 : 0));
            break;
          case "Tab":
            e.preventDefault();
            handleOptionListClose();

            break;
          case "Enter":
            e.preventDefault();
            if (optionCursor > -1 && options[optionCursor]) {
              onChange(options[optionCursor]);
              handleOptionListClose();
            }
            break;
          case "Escape":
            e.preventDefault();
            handleOptionListClose();

            break;
        }
      } else {
        switch (e.key) {
          case "ArrowUp":
          case "ArrowDown":
            e.preventDefault();
            handleOptionListOpen();
            break;
        }
      }
    },
    [
      handleOptionListClose,
      handleOptionListOpen,
      isOptionListOpen,
      onChange,
      optionCursor,
      options,
      selectRef,
      setOptionCursor,
    ],
  );

  useEffect(() => {
    const handleKeyUp = () => setIsKeyboardNavigate(false);
    window.addEventListener("keydown", handleKeyEvent);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyEvent);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyEvent]);

  const scrollToOption = useCallback(
    (index: number) => {
      const container = optionListRef.current;
      const option = optionButtonsRef.current[index];
      if (!container) return;
      if (!option) return;

      const rect = option.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (rect.bottom > containerRect.bottom) {
        const offset = rect.bottom - containerRect.bottom;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: "auto",
        });
      } else if (rect.top < containerRect.top) {
        const offset = rect.top - containerRect.top;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: "auto",
        });
      }
    },
    [optionButtonsRef, optionListRef],
  );

  useEffect(() => {
    if (isKeyboardNavigate) {
      setIsMouseNavigate(false);
    }
  }, [isKeyboardNavigate, setIsMouseNavigate]);

  useEffect(() => {
    if (!isOptionListOpen) {
      setIsMouseNavigate(false);
      return;
    }
    if (isMouseNavigate) return;

    if (isOptionListOpen) {
      if (isKeyboardNavigate) {
        scrollToOption(optionCursor);
      }
    }
  }, [
    isKeyboardNavigate,
    isMouseNavigate,
    isOptionListOpen,
    optionButtonsRef,
    optionCursor,
    scrollToOption,
    setIsMouseNavigate,
  ]);

  return { optionButtonsRef };
};

export default useDropdownKeyHandler;
