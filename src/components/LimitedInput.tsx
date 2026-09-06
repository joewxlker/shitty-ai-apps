'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface LimitedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength: number;
  containerClassName?: string;
}

export const LimitedInput = forwardRef<HTMLInputElement, LimitedInputProps>(function LimitedInput(
  {
    maxLength,
    defaultValue,
    value: controlledValue,
    containerClassName,
    onChange,
    onInput,
    className,
    ...props
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);

  const [uncontrolledLength, setUncontrolledLength] = useState(() => {
    if (typeof defaultValue === 'string') return defaultValue.length;
    return 0;
  });

  useEffect(() => {
    const input = inputRef.current;
    if (!input?.form) return;
    const handleReset = () => {
      setUncontrolledLength(typeof defaultValue === 'string' ? defaultValue.length : 0);
    };
    const form = input.form;
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [defaultValue]);

  const currentLength =
    typeof controlledValue === 'string' ? controlledValue.length : uncontrolledLength;

  const isAtLimit = currentLength >= maxLength;

  return (
    <div className={containerClassName ?? 'w-full'}>
      <input
        ref={inputRef}
        {...props}
        defaultValue={defaultValue}
        value={controlledValue}
        maxLength={maxLength}
        className={className}
        onInput={(e) => {
          setUncontrolledLength((e.target as HTMLInputElement).value.length);
          onInput?.(e);
        }}
        onChange={(e) => {
          setUncontrolledLength(e.target.value.length);
          onChange?.(e);
        }}
      />
      {isAtLimit && (
        <p className="mt-1 text-xs font-medium text-amber-600">
          Character limit reached ({maxLength}/{maxLength})
        </p>
      )}
    </div>
  );
});

export interface LimitedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  containerClassName?: string;
}

export const LimitedTextarea = forwardRef<HTMLTextAreaElement, LimitedTextareaProps>(
  function LimitedTextarea(
    {
      maxLength,
      defaultValue,
      value: controlledValue,
      containerClassName,
      onChange,
      onInput,
      className,
      ...props
    },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current!);

    const [uncontrolledLength, setUncontrolledLength] = useState(() => {
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea?.form) return;
      const handleReset = () => {
        setUncontrolledLength(typeof defaultValue === 'string' ? defaultValue.length : 0);
      };
      const form = textarea.form;
      form.addEventListener('reset', handleReset);
      return () => form.removeEventListener('reset', handleReset);
    }, [defaultValue]);

    const currentLength =
      typeof controlledValue === 'string' ? controlledValue.length : uncontrolledLength;

    const isAtLimit = currentLength >= maxLength;

    return (
      <div className={containerClassName ?? 'w-full'}>
        <textarea
          ref={textareaRef}
          {...props}
          defaultValue={defaultValue}
          value={controlledValue}
          maxLength={maxLength}
          className={className}
          onInput={(e) => {
            setUncontrolledLength((e.target as HTMLTextAreaElement).value.length);
            onInput?.(e);
          }}
          onChange={(e) => {
            setUncontrolledLength(e.target.value.length);
            onChange?.(e);
          }}
        />
        {isAtLimit && (
          <p className="mt-1 text-xs font-medium text-amber-600">
            Character limit reached ({maxLength}/{maxLength})
          </p>
        )}
      </div>
    );
  }
);
