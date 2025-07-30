import React from 'react'
import './Column.css'

interface ColumnProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export const Column: React.FC<ColumnProps> = ({ children, className, style, ...props }) => {
    const classes = ['column', className].filter(Boolean).join(' ')

    return (
        <div className={classes} style={style} {...props}>
            {children}
        </div>
    )
}
