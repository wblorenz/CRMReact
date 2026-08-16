import React, { forwardRef } from 'react';
import './SearchInput.css';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    wrapperStyle?: React.CSSProperties;
    icon?: React.ReactNode;
    onClear?: () => void;
    showClear?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
    className = '',
    wrapperClassName = '',
    wrapperStyle,
    icon,
    value,
    onClear,
    showClear = false,
    type = 'text',
    ...restProps
}, ref) => {
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div className={`search-input-wrapper ${wrapperClassName}`.trim()} style={wrapperStyle}>
            <span className="search-input-icon" aria-hidden="true">
                {icon || (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                )}
            </span>
            <input
                ref={ref}
                type={type}
                value={value}
                className={`search-input ${className}`.trim()}
                {...restProps}
            />
            {showClear && hasValue && onClear && (
                <button
                    type="button"
                    className="search-input-clear-btn"
                    onClick={onClear}
                    title="Clear search"
                    aria-label="Clear search"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            )}
        </div>
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
