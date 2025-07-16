import React from 'react'
import styles from './ScreenWrapper.module.css'

interface ScreenWrapperProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    padding?: boolean
    center?: boolean
    background?: 'primary' | 'secondary' | 'elevated'
    overflow?: 'hidden' | 'auto' | 'scroll' | 'visible'
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    className,
    style,
    padding = false,
    center = false,
    background = 'primary',
    overflow = 'auto',
}) => {
    const classes = [
        styles.screenWrapper,
        padding && styles.withPadding,
        center && styles.centered,
        styles[background],
        styles[overflow],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    )
}
