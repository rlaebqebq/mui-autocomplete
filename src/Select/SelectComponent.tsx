import { ReactElement, useEffect, useMemo, useState } from 'react';

import useResolveFilterOptions from './utils/useResolveFilterOptions';
import useAdjustTextarea from './utils/useAdjustTextarea';
import useClickAway from './utils/useClickAway';
import useDropdownPosition from './utils/useDropdownPosition';
import useDropdownKeyHandler from './utils/useDropdownKeyHandler';
import type { TOption } from './utils/option.d';

import { ChevronDownIcon, XMarkIcon } from './assets';
import styles from './select.module.css';

const Select = ({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  value?: TOption;
  options: Array<TOption> | (() => Promise<Array<TOption>>);
  onChange: (option: TOption | undefined) => void;
}): ReactElement => {
  const [isMouseNavigate, setIsMouseNavigate] = useState<boolean>(false);

  const [keyword, setKeyword] = useState<string>('');

  const [isOptionListOpen, setIsOptionListOpen] = useState<boolean>(false);

  const [optionCursor, setOptionCursor] = useState(-1);

  const { resolvedOptions: filterOption, isLoading, isError } = useResolveFilterOptions(options, keyword, value);

  const textareaRef = useAdjustTextarea({ keyword, value });

  const selectRef = useClickAway(() => {
    setIsOptionListOpen(false);
  });

  const { optionListPosition, optionListRef } = useDropdownPosition({
    selectRef,
    isOptionListOpen,
    options: filterOption,
  });

  const { optionButtonsRef } = useDropdownKeyHandler({
    selectRef,
    optionListRef,
    isOptionListOpen,
    optionCursor,
    setOptionCursor,
    isMouseNavigate,
    setIsMouseNavigate,
    options: filterOption,
    onChange,
    handleOptionListOpen: () => {
      setIsOptionListOpen(true);
    },
    handleOptionListClose: () => {
      setOptionCursor(-1);
      setIsOptionListOpen(false);
    },
  });

  useEffect(() => {
    if (value) {
      const findIndex = filterOption.findIndex((i) => i.value === value.value && i.label === value.label);
      if (findIndex > -1) {
        setOptionCursor(findIndex);
      }
    } else {
      setOptionCursor(-1);
    }
  }, [filterOption, isOptionListOpen, options, value]);

  useEffect(() => {
    if (!isOptionListOpen) {
      setKeyword(value ? value.label : '');
    }
  }, [isOptionListOpen, value]);

  return (
    <div
      ref={selectRef}
      data-testid='select'
      className={`${styles.select} ${optionListPosition?.position === 'top' ? `${styles.selectTop}` : ''} ${isOptionListOpen ? `${styles.selectOpen}` : ''}${isLoading ? 'loading' : ''}${
        isError ? 'error' : ''
      }`}
    >
      <div
        className={isOptionListOpen ? `${styles.open}` : ''}
        role='combobox'
        data-testid='select-input-area'
        aria-controls='option-list'
        aria-expanded={isOptionListOpen}
        aria-haspopup='listbox'
        tabIndex={-1}
        onClick={() => {
          setIsOptionListOpen((prev) => {
            if (value) {
              return true;
            }
            return !prev;
          });
        }}
      >
        <label
          htmlFor={`select-${label}`}
          className={useMemo(() => {
            if (!label) {
              return 'hidden';
            }
            if (isOptionListOpen) {
              switch (optionListPosition?.position) {
                case 'top':
                  return 'hidden';
                case 'bottom':
                  return 'labelTop';
                default:
                  return '';
              }
            }
            return value ? 'labelTop' : '';
          }, [label, isOptionListOpen, optionListPosition?.position, value])}
        >
          {label || ''}
        </label>
        <textarea
          id={`select-${label}`}
          data-testid='select-textarea'
          ref={textareaRef}
          autoComplete='off'
          spellCheck={false}
          value={keyword || ''}
          tabIndex={0}
          onChange={({ currentTarget }) => {
            setKeyword(currentTarget.value);
            setIsOptionListOpen(true);

            if (currentTarget.value === '') {
              onChange(undefined);
            }
          }}
        />
        {value && (
          <button
            type='button'
            aria-label='select-delete-btn'
            data-testid='select-delete-btn'
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              setKeyword('');
              onChange(undefined);
            }}
          >
            <XMarkIcon />
          </button>
        )}
        {useMemo(() => {
          return (
            <button
              type='button'
              aria-label='select-open-btn'
              data-testid='select-open-btn'
              className={isOptionListOpen ? `${styles.openBtn}` : ''}
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionListOpen((prev) => !prev);
              }}
            >
              <ChevronDownIcon />
            </button>
          );
        }, [isOptionListOpen])}
      </div>
      {isOptionListOpen && (
        <div style={optionListPosition?.topY ? { top: `-${optionListPosition.topY + 2}px` } : {}}>
          <ul
            role='listbox'
            data-testid='option-list'
            ref={optionListRef}
            onMouseDown={(e) => e.preventDefault()}
            className={optionListPosition?.position !== undefined ? styles[`list${optionListPosition?.position}`] : ''}
            onMouseMove={() => setIsMouseNavigate(true)}
            style={optionListPosition?.rectHeight ? { maxHeight: `${optionListPosition?.rectHeight}px` } : {}}
          >
            {(() => {
              if (isLoading) {
                return (
                  <li>
                    <button type='button' className={`${styles.optionBtn} loading-btn`} data-testid='option' disabled>
                      Loading...
                    </button>
                  </li>
                );
              }
              if (isError) {
                return (
                  <li>
                    <button type='button' className={`${styles.optionBtn} error-btn`} data-testid='option' disabled>
                      Error
                    </button>
                  </li>
                );
              }
              if (filterOption.length < 1) {
                return (
                  <li>
                    <button type='button' className={styles.optionBtn} data-testid='option' disabled>
                      No Options
                    </button>
                  </li>
                );
              }
              return filterOption.map((option, idx) => {
                const isHovered = optionCursor === idx;
                const isSelected = value?.value === option.value;

                return (
                  <li key={option.value}>
                    <button
                      type='button'
                      ref={(e) => {
                        optionButtonsRef.current[idx] = e;
                      }}
                      data-testid='option'
                      className={`${isHovered ? `${styles.hovered}` : ''} ${isSelected ? `${styles.selected}` : ''}`}
                      onMouseEnter={() => {
                        if (isMouseNavigate) setOptionCursor(idx);
                      }}
                      onMouseLeave={() => {
                        if (isMouseNavigate) setOptionCursor(-1);
                      }}
                      onClick={() => {
                        onChange(option);
                        setIsOptionListOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
