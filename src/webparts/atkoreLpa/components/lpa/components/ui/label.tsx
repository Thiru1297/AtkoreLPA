// @ts-nocheck
import * as React from 'react';

export function Label(props: any): JSX.Element {
  const { className = '', ...rest } = props;
  return <label className={`text-sm font-medium ${className}`} {...rest} />;
}
