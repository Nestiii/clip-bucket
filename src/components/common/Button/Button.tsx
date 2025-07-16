import React, { MouseEventHandler } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
    children?: React.ReactNode
    text?: string
    icon?: string | React.ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'transparent' | 'transparent-bordered'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    type?: 'button' | 'submit' | 'reset'
    title?: string,
    disableTabbing?: boolean,
    autoFocus?: boolean,
    fullWidth?: boolean,
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  text,
                                                  icon,
                                                  onClick,
                                                  variant = 'primary',
                                                  size = 'md',
                                                  disabled = false,
                                                  disableTabbing = false,
                                                  className,
                                                  style,
                                                  type = 'button',
                                                  autoFocus,
                                                  title,
                                                  fullWidth,
                                                  ...props
                                              }) => {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
    ].filter(Boolean).join(' ')

    return (
        <button
            tabIndex={disableTabbing ? -1 : 0}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            style={style}
            type={type}
            title={title}
            autoFocus={autoFocus}
            {...props}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {text && <span className={styles.text}>{text}</span>}
            {children}
        </button>
    )
}
