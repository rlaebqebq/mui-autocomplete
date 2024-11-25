import { MutableRefObject, useEffect, useRef } from 'react';
import type { TOption } from './option.d';

const useAdjustTextarea = ({
  keyword,
  value,
}: {
  keyword: string;
  value?: TOption;
}): MutableRefObject<HTMLTextAreaElement | null> => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [keyword, value]);

  useEffect(() => {
    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  return textareaRef;
};

export default useAdjustTextarea;
