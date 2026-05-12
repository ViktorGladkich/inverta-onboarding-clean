'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

// ============================================
// INPUT
// ============================================
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  required?: boolean;
  hint?: string;
}

export function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  hint,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-gray)] flex items-center gap-2"
      >
        {label}
        {required && (
          <span className="text-[var(--color-bg-lime)] text-[9px]">*</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="
          bg-transparent
          border-0
          border-b
          border-[var(--color-border-subtle)]
          py-2.5
          px-0
          text-base
          text-[var(--color-text-white)]
          placeholder:text-[var(--color-text-dim)]
          focus:border-[var(--color-bg-lime)]
          transition-colors
          font-body
        "
      />
      {hint && (
        <p className="text-[10px] text-[var(--color-text-dim)] font-mono">
          {hint}
        </p>
      )}
    </div>
  );
}

// ============================================
// TEXTAREA
// ============================================
export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-gray)]"
      >
        {label}
        {required && (
          <span className="text-[var(--color-bg-lime)] text-[9px] ml-2">*</span>
        )}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="
          bg-[var(--color-bg-card)]
          border
          border-[var(--color-border-subtle)]
          rounded-sm
          py-3
          px-3
          text-base
          text-[var(--color-text-white)]
          placeholder:text-[var(--color-text-dim)]
          focus:border-[var(--color-bg-lime)]
          transition-colors
          font-body
          resize-none
        "
      />
    </div>
  );
}

// ============================================
// CHECKBOX
// ============================================
export function Checkbox({
  label,
  checked,
  onChange,
  name,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="custom-checkbox"
      />
      <span className="text-[14px] text-[var(--color-text-white)] group-hover:text-[var(--color-bg-lime)] transition-colors leading-tight">
        {label}
      </span>
    </label>
  );
}

// ============================================
// RADIO GROUP
// ============================================
export function RadioGroup({
  label,
  options,
  value,
  onChange,
  name,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-bg-lime)]">
        — {label}
      </p>
      <div className="flex flex-col gap-2 mt-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer group py-1"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="custom-radio"
            />
            <span className="text-[14px] text-[var(--color-text-white)] group-hover:text-[var(--color-bg-lime)] transition-colors leading-tight">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADING (editorial style)
// ============================================
export function SectionHeading({
  step,
  title,
  italic,
  priority,
  description,
}: {
  step: string;
  title: string;
  italic?: string;
  priority?: 'KRITISCH' | 'WICHTIG' | 'OPTIONAL';
  description?: string;
}) {
  const priorityColors = {
    KRITISCH: 'bg-[var(--color-critical)] text-white',
    WICHTIG: 'bg-[var(--color-bg-lime)] text-[var(--color-text-black)]',
    OPTIONAL: 'bg-[var(--color-text-dim)] text-white',
  };

  return (
    <div className="flex flex-col gap-3 mb-8">
      {priority && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`self-start px-2.5 py-1 ${priorityColors[priority]} font-mono text-[10px] font-bold tracking-wider uppercase`}
        >
          {priority}
        </motion.div>
      )}

      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-bg-lime)]">
        — {step}
      </p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display font-bold text-[38px] sm:text-[48px] leading-[0.95] tracking-tight"
      >
        {title}
        {italic && (
          <>
            {' '}
            <span className="font-serif italic text-[var(--color-bg-lime)] text-[42px] sm:text-[54px] font-normal">
              {italic}
            </span>
          </>
        )}
      </motion.h1>

      {description && (
        <p className="text-[14px] text-[var(--color-text-gray)] leading-relaxed max-w-md mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

// ============================================
// FIELD GROUP LABEL
// ============================================
export function FieldGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-bg-lime)] mt-2 mb-1">
      — {children}
    </p>
  );
}
