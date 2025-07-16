import React from 'react'
import styles from './ErrorFallback.module.css'
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
        <div className={styles.errorFallback}>
            <div className={styles.errorContent}>
                <div className={styles.errorIcon}>⚠️</div>
                <h1 className={styles.errorTitle}>{title}</h1>
                <p className={styles.errorMessage}>{message}</p>
                {isDev && error && (
                    <details className={styles.errorDetails}>
                        <summary className={styles.errorSummary}>
                            {'Show technical details'}
                        </summary>
                        <pre className={styles.errorStack}>
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
                <div className={styles.errorActions}>
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
                <div className={styles.errorHelp}>
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
