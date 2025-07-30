import React from 'react'
import './ScreenWrapper.css'

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
        'screen-wrapper',
        padding && 'screen-wrapper--with-padding',
        center && 'screen-wrapper--centered',
        `screen-wrapper--${background}`,
        `screen-wrapper--${overflow}`,
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
