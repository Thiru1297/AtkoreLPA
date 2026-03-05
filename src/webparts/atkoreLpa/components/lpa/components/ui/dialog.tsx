// @ts-nocheck
import * as React from 'react';

const DialogContext: React.Context<any> = React.createContext({
  open: false,
  setOpen: (_value: boolean) => undefined
});

export function Dialog(props: any): JSX.Element {
  const { open, onOpenChange, children } = props;
  const [internalOpen, setInternalOpen] = React.useState<boolean>(false);
  const resolvedOpen: boolean = open !== undefined ? !!open : internalOpen;

  const setOpen = (value: boolean): void => {
    if (onOpenChange) {
      onOpenChange(value);
    }
    if (open === undefined) {
      setInternalOpen(value);
    }
  };

  return (
    <DialogContext.Provider value={{ open: resolvedOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent(props: any): JSX.Element | null {
  const { open } = React.useContext(DialogContext);
  const { className = '', children } = props;
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 md:items-center md:p-4">
      <div className={`w-full max-w-lg rounded-t-2xl bg-white p-4 shadow-lg max-h-[90vh] overflow-y-auto md:rounded-lg md:p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader(props: any): JSX.Element {
  return <div className={`mb-4 ${props.className || ''}`}>{props.children}</div>;
}

export function DialogTitle(props: any): JSX.Element {
  return <h3 className={`text-lg font-semibold ${props.className || ''}`}>{props.children}</h3>;
}

export function DialogDescription(props: any): JSX.Element {
  return <p className={`mt-1 text-sm text-[#605E5C] ${props.className || ''}`}>{props.children}</p>;
}

export function DialogFooter(props: any): JSX.Element {
  return <div className={`mt-5 flex justify-end gap-2 ${props.className || ''}`}>{props.children}</div>;
}
