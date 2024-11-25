import { MutableRefObject, useEffect, useRef } from 'react';

const useClickAway = (callback: () => void): MutableRefObject<HTMLDivElement | null> => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent | TouchEvent) => {
      const div = divRef?.current;
      if (div && !div.contains(e.target as Node)) {
        callback();
      }
    };

    const handleBlur = () => {
      if (divRef.current && !divRef.current.contains(document.activeElement)) {
        callback();
      }
    };

    const currentRef = divRef.current;
    if (currentRef) currentRef.addEventListener('blur', handleBlur);

    document.addEventListener('mouseup', handleClickAway);
    document.addEventListener('touchend', handleClickAway);

    return () => {
      if (currentRef) currentRef.removeEventListener('blur', handleBlur);
      document.removeEventListener('mouseup', handleClickAway);
      document.removeEventListener('touchend', handleClickAway);
    };
  }, [callback]);

  return divRef;
};

export default useClickAway;
