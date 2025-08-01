import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '../ErrorFallback/ErrorFallback.tsx'
import { Outlet } from 'react-router-dom'

interface AppErrorBoundaryProps {
    fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
    resetKeys?: (string | number)[]
}

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({
    fallback = ErrorFallback,
    resetKeys,
    ...props
}) => {
    return (
        <ErrorBoundary FallbackComponent={fallback} resetKeys={resetKeys} {...props}>
            <Outlet />
        </ErrorBoundary>
    )
}
