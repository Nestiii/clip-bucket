import React from 'react'
import './Welcome.css'
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
            <Column className="welcome-screen">
                <div className="welcome-screen__header">
                    <div className="welcome-screen__logo">
                        <h1 className="welcome-screen__title">Welcome to ClipBucket</h1>
                    </div>
                    <p className="welcome-screen__subtitle">
                        A modern, privacy-first clipboard manager for developers and power users
                    </p>
                </div>
                <div className="welcome-screen__shortcuts">
                    <h2>Keyboard Shortcuts</h2>
                    <div className="welcome-screen__shortcuts-list">
                        <div className="welcome-screen__shortcut">
                            <div className="welcome-screen__keys">
                                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
                            </div>
                            <span>Toggle ClipBucket window</span>
                        </div>
                        <div className="welcome-screen__shortcut">
                            <div className="welcome-screen__keys">
                                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
                            </div>
                            <span>Quick capture clipboard to last used bucket</span>
                        </div>
                    </div>
                    <p className="welcome-screen__shortcuts-note">
                        💡 You can customize these shortcuts in Settings
                    </p>
                </div>
                <div className="welcome-screen__quick-start">
                    <h2>Quick Start</h2>
                    <ol className="welcome-screen__steps">
                        <li>Create your first bucket to organize clipboard items</li>
                        <li>Copy something to your system clipboard</li>
                        <li>
                            Use <kbd>Ctrl+Shift+C</kbd> to quickly save it
                        </li>
                        <li>Click any saved item to copy it back</li>
                        <li>
                            Use <kbd>Ctrl+Shift+P</kbd> to show/hide ClipBucket
                        </li>
                    </ol>
                </div>
                <Button variant="primary" size="lg" onClick={handleGetStarted} fullWidth>
                    Get Started
                </Button>
                <div className="welcome-screen__footer">
                    <p>ClipBucket runs quietly in your system tray</p>
                    <p>Right-click the tray icon for quick access to settings</p>
                </div>
            </Column>
        </ScreenWrapper>
    )
}
