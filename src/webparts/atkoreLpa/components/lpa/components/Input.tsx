// @ts-nocheck
import * as React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#1B1B1B]">
          {label}
        </label>
      )}
      <input
        className={`h-11 px-3 rounded border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#1B1B1B] 
          placeholder:text-[#605E5C] focus:outline-none focus:ring-2 focus:ring-[#4CAC48] 
          disabled:bg-[#F3F2F1] disabled:cursor-not-allowed ${error ? 'border-[#D13438]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#D13438]">{error}</span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#1B1B1B]">
          {label}
        </label>
      )}
      <textarea
        className={`min-h-24 px-3 py-2 rounded border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#1B1B1B] 
          placeholder:text-[#605E5C] focus:outline-none focus:ring-2 focus:ring-[#4CAC48] 
          disabled:bg-[#F3F2F1] disabled:cursor-not-allowed resize-y ${error ? 'border-[#D13438]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[#D13438]">{error}</span>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#1B1B1B]">
          {label}
        </label>
      )}
      <select
        className={`h-11 px-3 rounded border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#1B1B1B] 
          focus:outline-none focus:ring-2 focus:ring-[#4CAC48] 
          disabled:bg-[#F3F2F1] disabled:cursor-not-allowed ${error ? 'border-[#D13438]' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-[#D13438]">{error}</span>
      )}
    </div>
  );
}


