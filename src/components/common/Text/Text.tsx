import React from 'react'
import styles from './Text.module.css'

interface TextProps {
    children: React.ReactNode
    as?: 'span' | 'pre' | 'p' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl'
    weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'danger' | 'warning'
    align?: 'left' | 'center' | 'right'
    transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    truncate?: boolean
    mono?: boolean
    italic?: boolean
    underline?: boolean
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
    title?: string
    id?: string
}

export const Text: React.FC<TextProps> = ({
                                              children,
                                              as: Component = 'span',
                                              size = 'base',
                                              weight = 'normal',
                                              color = 'primary',
                                              align = 'left',
                                              transform = 'none',
                                              truncate = false,
                                              mono = false,
                                              italic = false,
                                              underline = false,
                                              className,
                                              style,
                                              onClick,
                                              title,
                                              id,
                                              ...props
                                          }) => {
    const classes = [
        styles.text,
        styles[size],
        styles[`weight-${weight}`],
        styles[`color-${color}`],
        styles[`align-${align}`],
        styles[`transform-${transform}`],
        truncate && styles.truncate,
        mono && styles.mono,
        italic && styles.italic,
        underline && styles.underline,
        onClick && styles.clickable,
        className
    ].filter(Boolean).join(' ')

    return (
        <Component
            className={classes}
            style={style}
            onClick={onClick}
            title={title}
            id={id}
            {...props}
        >
            {children}
        </Component>
    )
}
