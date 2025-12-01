// src/types/ink.d.ts
declare module 'ink' {
  import * as React from 'react';

  // Basic components you use
  export function Box(props: any): any;
  export function Text(props: any): any;

  // render() signature used in your entry point
  export function render(el: React.ReactElement): { unmount?: () => void } | void;

  // hooks
  export function useInput(handler: (input: string, key: { upArrow?: boolean; downArrow?: boolean; ctrl?: boolean; meta?: boolean; shift?: boolean; name?: string }) => void): void;
  export function useApp(): { exit(code?: number): void };

  // default for safety
  const _default: any;
  export interface TextInputProps {
    value?: string;
    onChange?: (v: string) => void;
    placeholder?: string;
    showCursor?: boolean;
    mask?: string;
  }
  const TextInput: React.FC<TextInputProps>;
  export default TextInput;
  export default _default;
}
