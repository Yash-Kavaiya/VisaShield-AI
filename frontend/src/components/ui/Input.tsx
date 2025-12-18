import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'input',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        error && 'input-error',
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {hint && !error && (
                <p className="mt-1 text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
}

interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
    onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
    return (
        <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search..."
            {...props}
        />
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({
    label,
    error,
    options,
    className,
    id,
    ...props
}: SelectProps) {
    const selectId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="label">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={cn(
                    'input appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236B7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10',
                    error && 'input-error',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
    const checkboxId = id || props.name;

    return (
        <label
            htmlFor={checkboxId}
            className="flex items-center gap-2 cursor-pointer"
        >
            <input
                type="checkbox"
                id={checkboxId}
                className={cn(
                    'w-4 h-4 rounded border-gray-300 text-[var(--secondary-blue)] focus:ring-[var(--secondary-blue)]',
                    className
                )}
                {...props}
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}
