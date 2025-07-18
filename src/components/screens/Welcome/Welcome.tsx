import React from 'react'
import styles from './Welcome.module.css'
import { useNavigate } from 'react-router-dom'
import { Column } from '../../common/Column/Column'
import { Button } from '../../common/Button/Button'
import { ROUTES } from '../../../router/routes'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'

export const Welcome: React.FC = () => {
    const navigate = useNavigate()

    const handleGetStarted = async () => {
        const result = await window.api.updateWelcome()
        if (result.success) navigate(ROUTES.ROOT)
    }

    return (
        <ScreenWrapper>
            <Column className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <h1 className={styles.title}>Welcome to ClipBucket</h1>
                    </div>
                    <p className={styles.subtitle}>
                        A modern, privacy-first clipboard manager for developers and power users
                    </p>
                </div>
                <div className={styles.shortcuts}>
                    <h2>Keyboard Shortcuts</h2>
                    <div className={styles.shortcutsList}>
                        <div className={styles.shortcut}>
                            <div className={styles.keys}>
                                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
                            </div>
                            <span>Toggle ClipBucket window</span>
                        </div>
                        <div className={styles.shortcut}>
                            <div className={styles.keys}>
                                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
                            </div>
                            <span>Quick capture clipboard to last used bucket</span>
                        </div>
                    </div>
                    <p className={styles.shortcutsNote}>
                        💡 You can customize these shortcuts in Settings
                    </p>
                </div>
                <div className={styles.quickStart}>
                    <h2>Quick Start</h2>
                    <ol className={styles.steps}>
                        <li>Create your first bucket to organize clipboard items</li>
                        <li>Copy something to your system clipboard</li>
                        <li>Use <kbd>Ctrl+Shift+C</kbd> to quickly save it</li>
                        <li>Click any saved item to copy it back</li>
                        <li>Use <kbd>Ctrl+Shift+P</kbd> to show/hide ClipBucket</li>
                    </ol>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGetStarted}
                    fullWidth
                >
                    Get Started
                </Button>
                <div className={styles.footer}>
                    <p>ClipBucket runs quietly in your system tray</p>
                    <p>Right-click the tray icon for quick access to settings</p>
                </div>
            </Column>
        </ScreenWrapper>
    )
}
