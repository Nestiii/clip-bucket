import React from 'react'
import styles from './Column.module.css'

interface ColumnProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export const Column: React.FC<ColumnProps> = ({ children, className, style, ...props }) => {
    const classes = [styles.column, className].filter(Boolean).join(' ')

    return (
        <div className={classes} style={style} {...props}>
            {children}
        </div>
    )
}
