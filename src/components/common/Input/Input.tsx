import React, { forwardRef } from 'react'
import './Input.css'

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
    value?: string
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autoFocus?: boolean
    autoComplete?: string
    className?: string
    style?: React.CSSProperties
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'minimal' | 'bordered' | 'filled'
    error?: boolean
    success?: boolean
    fullWidth?: boolean
    name?: string
    id?: string
    'aria-label'?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
    min?: number
    max?: number
    step?: number
    maxLength?: number
    minLength?: number
    pattern?: string
    title?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    prefix?: string
    suffix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = 'text',
            value,
            defaultValue,
            onChange,
            onFocus,
            onBlur,
            onKeyDown,
            placeholder,
            disabled = false,
            readonly = false,
            required = false,
            autoFocus = false,
            autoComplete,
            className,
            style,
            size = 'md',
            variant = 'default',
            error = false,
            success = false,
            fullWidth = false,
            name,
            id,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'aria-invalid': ariaInvalid,
            min,
            max,
            step,
            maxLength,
            minLength,
            pattern,
            title,
            leftIcon,
            rightIcon,
            prefix,
            suffix,
            ...props
        },
        ref
    ) => {
        const hasWrapperElements = leftIcon || rightIcon || prefix || suffix

        const inputClasses = [
            'input',
            `input--${variant}`,
            `input--${size}`,
            error && 'input--error',
            success && 'input--success',
            disabled && 'input--disabled',
            readonly && 'input--readonly',
            fullWidth && 'input--full-width',
            hasWrapperElements && 'input--has-wrapper',
            className,
        ]
            .filter(Boolean)
            .join(' ')

        const inputElement = (
            <input
                ref={ref}
                type={type}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                required={required}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                className={hasWrapperElements ? 'input__element' : inputClasses}
                name={name}
                id={id}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid || error}
                min={min}
                max={max}
                step={step}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                title={title}
                {...props}
            />
        )

        if (hasWrapperElements) {
            return (
                <div className={inputClasses} style={style}>
                    {leftIcon && <span className="input__left-icon">{leftIcon}</span>}
                    {prefix && <span className="input__prefix">{prefix}</span>}
                    {inputElement}
                    {suffix && <span className="input__suffix">{suffix}</span>}
                    {rightIcon && <span className="input__right-icon">{rightIcon}</span>}
                </div>
            )
        }

        return React.cloneElement(inputElement, { style })
    }
)

Input.displayName = 'Input'
