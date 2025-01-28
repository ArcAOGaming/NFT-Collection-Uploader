import React from 'react';
import './TextInput.css';

interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    multiline?: boolean;
    placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    required = false,
    multiline = false,
    placeholder = ''
}) => {
    return (
        <div className="text-input-container">
            <label className="text-input-label">
                {label}
                {required && <span className="required">*</span>}
            </label>
            {multiline ? (
                <textarea
                    className="text-input multiline"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <input
                    type="text"
                    className="text-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
};
