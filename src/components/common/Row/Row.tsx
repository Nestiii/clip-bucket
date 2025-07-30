import React from 'react'
import './Row.css'

interface RowProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export const Row: React.FC<RowProps> = ({ children, className, style, ...props }) => {
    const classes = ['row', className].filter(Boolean).join(' ')

    return (
        <div className={classes} style={style} {...props}>
            {children}
        </div>
    )
}
