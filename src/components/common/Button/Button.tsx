import React, { MouseEventHandler } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
    children?: React.ReactNode
    text?: string
    icon?: string | React.ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'transparent'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    type?: 'button' | 'submit' | 'reset'
    title?: string
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  text,
                                                  icon,
                                                  onClick,
                                                  variant = 'primary',
                                                  size = 'md',
                                                  disabled = false,
                                                  className,
                                                  style,
                                                  type = 'button',
                                                  title,
                                                  ...props
                                              }) => {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        className,
    ].filter(Boolean).join(' ')

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
            style={style}
            type={type}
            title={title}
            {...props}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {text && <span className={styles.text}>{text}</span>}
            {children}
        </button>
    )
}
