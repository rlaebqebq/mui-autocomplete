import { useEffect, useMemo, useState } from "react";

import type { TOption } from "./option.d";
import debounce from "./debounce";

const filterData = ({
  data,
  keyword,
}: {
  data: Array<TOption>;
  keyword: string;
}): Array<TOption> => {
  const lowerCaseKeyword = keyword.toLowerCase();
  return data.filter((item) =>
    item.label.toLowerCase().includes(lowerCaseKeyword),
  );
};

const useResolveFilterOptions = (
  options: Array<TOption> | (() => Promise<Array<TOption>>),
  keyword: string,
  value?: TOption,
): {
  resolvedOptions: Array<TOption>;
  isLoading: boolean;
  isError: boolean;
} => {
  const [resolvedOptions, setResolvedOptions] = useState<Array<TOption>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(keyword);

  const debouncedSetKeyword = debounce((newKeyword: string) => {
    setDebouncedKeyword(newKeyword);
  }, 100);

  useEffect(() => {
    debouncedSetKeyword(keyword);
  }, [debouncedSetKeyword, keyword]);

  useEffect(() => {
    const resolveOptions = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        if (typeof options === "function") {
          const data = await options();
          setResolvedOptions(data || []);
        } else {
          setResolvedOptions(options || []);
        }
      } catch (error) {
        setResolvedOptions([]);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    resolveOptions();
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (value && value.label === keyword) return resolvedOptions;
    if (keyword.length < 1) return resolvedOptions;
    return filterData({ data: resolvedOptions, keyword: debouncedKeyword });
  }, [debouncedKeyword, keyword, resolvedOptions, value]);

  return { resolvedOptions: filteredOptions, isLoading, isError };
};

export default useResolveFilterOptions;
