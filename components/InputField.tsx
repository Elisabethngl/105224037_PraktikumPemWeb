import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  isTextArea?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  error,
  helperText,
  isTextArea = false,
  className = '',
  required,
  ...props
}) => {
  const inputClass = `w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 p-3 ${
    error
      ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 bg-white text-gray-800 focus:border-emerald-600 focus:ring-emerald-200'
  } ${className}`;

  return (
    <div className="space-y-1.5 text-left w-full">
      <label htmlFor={id} className="block text-xs font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isTextArea ? (
        <textarea
          id={id}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          rows={3}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}

      {error ? (
        <p id={`${id}-error`} className="text-xs font-semibold text-red-600 flex items-center gap-1" role="alert">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};