// @ts-nocheck
import * as React from 'react';

export function Textarea(props: any): JSX.Element {
  const { className = '', ...rest } = props;
  return (
    <textarea
      className={`min-h-16 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2 text-sm ${className}`}
      {...rest}
    />
  );
}
