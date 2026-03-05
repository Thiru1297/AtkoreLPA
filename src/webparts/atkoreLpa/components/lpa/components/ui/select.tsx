// @ts-nocheck
import * as React from 'react';

const SelectContext: React.Context<any> = React.createContext({
  open: false,
  setOpen: (_open: boolean) => undefined,
  value: '',
  onValueChange: (_value: string) => undefined
});

export function Select(props: any): JSX.Element {
  const { value, onValueChange, children } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleDocumentClick = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (!target || !containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleValueChange = (nextValue: string): void => {
    onValueChange?.(nextValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value, onValueChange: handleValueChange }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger(props: any): JSX.Element {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      className={props.className || ''}
      onClick={() => setOpen(!open)}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      {props.children}
    </button>
  );
}

export function SelectValue(props: any): JSX.Element {
  const { value } = React.useContext(SelectContext);
  const normalizedValue: string = String(value || '').trim();
  const formattedValue: string = normalizedValue
    ? normalizedValue
        .split('-')
        .map((part: string) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part)
        .join(' ')
    : '';

  return <span>{formattedValue || props.placeholder || 'Select'}</span>;
}

export function SelectContent(props: any): JSX.Element {
  const { open } = React.useContext(SelectContext);
  if (!open) {
    return <></>;
  }

  const defaultClassName =
    'absolute left-0 top-full z-50 mt-2 min-w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white p-1 shadow-lg';
  const className = props.className ? `${defaultClassName} ${props.className}` : defaultClassName;

  return (
    <div className={className} role="listbox">
      {props.children}
    </div>
  );
}

export function SelectItem(props: any): JSX.Element {
  const { onValueChange } = React.useContext(SelectContext);
  const { value, children, className = '' } = props;
  return (
    <button
      type="button"
      className={`block w-full rounded px-2 py-1 text-left hover:bg-[#EEF7EE] ${className}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
}
