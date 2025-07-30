import React from 'react'
import './ErrorFallback.css'
import { Button } from '../../common/Button/Button.tsx'

interface ErrorFallbackProps {
    error?: Error
    title?: string
    message?: string
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    title = 'Oops! Something went wrong',
    message = "We're sorry, but something unexpected happened. Please try again.",
}) => {
    const isDev = process.env.NODE_ENV === 'development'

    return (
        <div className="error-fallback">
            <div className="error-content">
                <div className="error-icon">⚠️</div>
                <h1 className="error-title">{title}</h1>
                <p className="error-message">{message}</p>
                {isDev && error && (
                    <details className="error-details">
                        <summary className="error-summary">{'Show technical details'}</summary>
                        <pre className="error-stack">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
                <div className="error-actions">
                    <Button
                        text={'Try Again'}
                        icon={'🔄'}
                        variant={'primary'}
                        onClick={() => window.location.reload()}
                    />
                    <Button
                        text={'Go Home'}
                        icon={'🏠'}
                        variant={'secondary'}
                        onClick={() => (window.location.href = '/')}
                    />
                </div>
                <div className="error-help">
                    <p>{'If this problem persists, try:'}</p>
                    <ul>
                        <li>{'Restarting the application'}</li>
                        <li>{'Checking your clipboard permissions'}</li>
                        <li>{'Clearing your buckets data'}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
