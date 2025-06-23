// src/renderer/src/components/Textarea.tsx
import React, { forwardRef } from 'react'
import styles from './Textarea.module.css'

interface TextareaProps {
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    className?: string
    style?: React.CSSProperties
    rows?: number
    cols?: number
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
    variant?: 'default' | 'minimal' | 'bordered'
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    success?: boolean
    autoFocus?: boolean
    maxLength?: number
    minLength?: number
    required?: boolean
    name?: string
    id?: string
    'aria-label'?: string
    'aria-describedby'?: string
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
                                                                            value,
                                                                            onChange,
                                                                            placeholder = "Paste or type your content here...",
                                                                            disabled = false,
                                                                            readonly = false,
                                                                            className,
                                                                            style,
                                                                            rows = 4,
                                                                            cols,
                                                                            resize = 'vertical',
                                                                            variant = 'default',
                                                                            size = 'md',
                                                                            error = false,
                                                                            success = false,
                                                                            autoFocus = false,
                                                                            maxLength,
                                                                            minLength,
                                                                            required = false,
                                                                            name,
                                                                            id,
                                                                            'aria-label': ariaLabel,
                                                                            'aria-describedby': ariaDescribedBy,
                                                                            onFocus,
                                                                            onBlur,
                                                                            onKeyDown,
                                                                            ...props
                                                                        }, ref) => {
    const classes = [
        styles.textarea,
        styles[variant],
        styles[size],
        error && styles.error,
        success && styles.success,
        disabled && styles.disabled,
        readonly && styles.readonly,
        className
    ].filter(Boolean).join(' ')

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            className={classes}
            style={{resize, ...style}}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            name={name}
            id={id}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            autoFocus={autoFocus}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            {...props}
        />
    )
})

Textarea.displayName = 'Textarea'
