import React from 'react';

type TextAreaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  textareaClassName?: string;
  rows?: number;
};

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rightElement,
  containerClassName,
  textareaClassName,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${textareaClassName}`}
        />
        {rightElement && (
          <div className="absolute bottom-2 right-3 text-sm text-gray-400">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
