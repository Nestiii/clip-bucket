import React, { useState, useEffect } from 'react'
import './Settings.css'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'
import { Column } from '../../common/Column/Column.tsx'
import { Row } from '../../common/Row/Row.tsx'
import { Text } from '../../common/Text/Text.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { CheckIcon, XIcon } from '@phosphor-icons/react'

type WindowSize = 'small' | 'medium' | 'large'

interface WindowSizeOption {
    value: WindowSize
    label: string
    description: string
    dimensions: { width: number; height: number }
}

const WINDOW_SIZE_OPTIONS: WindowSizeOption[] = [
    {
        value: 'small',
        label: 'Small',
        description: 'Compact size for minimal screen usage',
        dimensions: { width: 320, height: 480 },
    },
    {
        value: 'medium',
        label: 'Medium',
        description: 'Balanced size for most workflows',
        dimensions: { width: 400, height: 600 },
    },
    {
        value: 'large',
        label: 'Large',
        description: 'Spacious for handling longer content',
        dimensions: { width: 520, height: 720 },
    },
]

export const Settings: React.FC = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>('medium')
    const [toggleShortcut, setToggleShortcut] = useState<string>('CommandOrControl+Shift+L')
    const [quickCaptureShortcut, setQuickCaptureShortcut] = useState<string>('CommandOrControl+Shift+C')
    const [isEditingToggleShortcut, setIsEditingToggleShortcut] = useState<boolean>(false)
    const [isEditingQuickCaptureShortcut, setIsEditingQuickCaptureShortcut] = useState<boolean>(false)
    const [tempToggleShortcut, setTempToggleShortcut] = useState<string>('')
    const [tempQuickCaptureShortcut, setTempQuickCaptureShortcut] = useState<string>('')
    const [isRecordingToggleShortcut, setIsRecordingToggleShortcut] = useState<boolean>(false)
    const [isRecordingQuickCaptureShortcut, setIsRecordingQuickCaptureShortcut] = useState<boolean>(false)
    const [recordedToggleKeys, setRecordedToggleKeys] = useState<string[]>([])
    const [recordedQuickCaptureKeys, setRecordedQuickCaptureKeys] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true)
                const config = await window.api.getConfig()
                if (config) {
                    setWindowSize(config.settings.windowSize || 'medium')
                    setToggleShortcut(
                        config.settings.shortcuts.toggleWindow || 'CommandOrControl+Shift+L'
                    )
                    setQuickCaptureShortcut(
                        config.settings.shortcuts.quickCapture || 'CommandOrControl+Shift+C'
                    )
                }
            } catch (error) {
                console.error('Error loading settings:', error)
            } finally {
                setLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleWindowSizeChange = async (size: WindowSize) => {
        try {
            const result = await window.api.updateWindowSize(size)
            if (result.success) {
                setWindowSize(size)
                console.log('Window size updated successfully')
            } else {
                console.error('Failed to update window size:', result.error)
                alert('Failed to update window size')
            }
        } catch (error) {
            console.error('Error updating window size:', error)
            alert('Error updating window size')
        }
    }

    const startToggleShortcutRecording = () => {
        setIsRecordingToggleShortcut(true)
        setRecordedToggleKeys([])
        setTempToggleShortcut('')
    }

    const stopToggleShortcutRecording = () => {
        setIsRecordingToggleShortcut(false)
        setRecordedToggleKeys([])
    }

    const startQuickCaptureShortcutRecording = () => {
        setIsRecordingQuickCaptureShortcut(true)
        setRecordedQuickCaptureKeys([])
        setTempQuickCaptureShortcut('')
    }

    const stopQuickCaptureShortcutRecording = () => {
        setIsRecordingQuickCaptureShortcut(false)
        setRecordedQuickCaptureKeys([])
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isRecordingToggleShortcut && !isRecordingQuickCaptureShortcut) return
        e.preventDefault()
        const keys: string[] = []
        if (e.ctrlKey || e.metaKey) keys.push('CommandOrControl')
        if (e.shiftKey) keys.push('Shift')
        if (e.altKey) keys.push('Alt')
        if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) {
            keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key)
        }
        
        if (isRecordingToggleShortcut) {
            setRecordedToggleKeys(keys)
            if (
                keys.length > 0 &&
                !['Control', 'Meta', 'Shift', 'Alt'].includes(keys[keys.length - 1])
            ) {
                setTempToggleShortcut(keys.join('+'))
            }
        } else if (isRecordingQuickCaptureShortcut) {
            setRecordedQuickCaptureKeys(keys)
            if (
                keys.length > 0 &&
                !['Control', 'Meta', 'Shift', 'Alt'].includes(keys[keys.length - 1])
            ) {
                setTempQuickCaptureShortcut(keys.join('+'))
            }
        }
    }

    const confirmToggleShortcutChange = async () => {
        if (!tempToggleShortcut) return
        try {
            const validation = await window.api.validateShortcut(tempToggleShortcut)
            if (!validation.valid) {
                alert(`Invalid shortcut: ${validation.reason}`)
                return
            }
            const result = await window.api.updateShortcuts({
                toggleWindow: tempToggleShortcut,
            })
            if (result.success) {
                setToggleShortcut(tempToggleShortcut)
                setIsEditingToggleShortcut(false)
                setIsRecordingToggleShortcut(false)
                setTempToggleShortcut('')
                setRecordedToggleKeys([])
                console.log('Toggle shortcut updated successfully')
            } else {
                alert('Failed to update toggle shortcut')
            }
        } catch (error) {
            console.error('Error updating toggle shortcut:', error)
            alert('Error updating toggle shortcut')
        }
    }

    const confirmQuickCaptureShortcutChange = async () => {
        if (!tempQuickCaptureShortcut) return
        try {
            const validation = await window.api.validateShortcut(tempQuickCaptureShortcut)
            if (!validation.valid) {
                alert(`Invalid shortcut: ${validation.reason}`)
                return
            }
            const result = await window.api.updateShortcuts({
                quickCapture: tempQuickCaptureShortcut,
            })
            if (result.success) {
                setQuickCaptureShortcut(tempQuickCaptureShortcut)
                setIsEditingQuickCaptureShortcut(false)
                setIsRecordingQuickCaptureShortcut(false)
                setTempQuickCaptureShortcut('')
                setRecordedQuickCaptureKeys([])
                console.log('Quick capture shortcut updated successfully')
            } else {
                alert('Failed to update quick capture shortcut')
            }
        } catch (error) {
            console.error('Error updating quick capture shortcut:', error)
            alert('Error updating quick capture shortcut')
        }
    }

    const cancelToggleShortcutChange = () => {
        setIsEditingToggleShortcut(false)
        setIsRecordingToggleShortcut(false)
        setTempToggleShortcut('')
        setRecordedToggleKeys([])
    }

    const cancelQuickCaptureShortcutChange = () => {
        setIsEditingQuickCaptureShortcut(false)
        setIsRecordingQuickCaptureShortcut(false)
        setTempQuickCaptureShortcut('')
        setRecordedQuickCaptureKeys([])
    }

    const formatShortcut = (shortcutString: string) => {
        return shortcutString
            .replace('CommandOrControl', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
            .replace('Shift', '⇧')
            .replace('Alt', '⌥')
            .replace(/\+/g, ' + ')
    }

    if (loading) return null

    return (
        <ScreenWrapper>
            <div className="settings-screen" onKeyDown={handleKeyDown} tabIndex={0}>
                <Column className="settings-screen__main-column">
                    <Column className="settings-screen__section">
                        <Row className="settings-screen__section-header">
                            <Text size="lg" weight="semibold">
                                Window Size
                            </Text>
                        </Row>
                        <Column className="settings-screen__options">
                            {WINDOW_SIZE_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    className={`settings-screen__option ${windowSize === option.value ? 'settings-screen__option--selected' : ''}`}
                                    onClick={() => handleWindowSizeChange(option.value)}
                                >
                                    <Row className="settings-screen__option-row">
                                        <Column className="settings-screen__option-content">
                                            <Text weight="medium">{option.label}</Text>
                                            <Text size="sm" color="muted">
                                                {option.description}
                                            </Text>
                                        </Column>
                                        <div className="settings-screen__radio-button">
                                            {windowSize === option.value && (
                                                <div className="settings-screen__radio-button-dot" />
                                            )}
                                        </div>
                                    </Row>
                                </div>
                            ))}
                        </Column>
                    </Column>
                    <Column className="settings-screen__section">
                        <Row className="settings-screen__section-header">
                            <Text size="lg" weight="semibold">
                                Keyboard Shortcuts
                            </Text>
                        </Row>
                        <Column className="settings-screen__shortcuts-list">
                            {/* Toggle Window Shortcut */}
                            <div className="settings-screen__shortcut-section">
                                <Column className="settings-screen__shortcut-column">
                                    <Column className="settings-screen__shortcut-info">
                                        <Text weight="medium">Toggle Window</Text>
                                        <Text size="sm" color="muted">
                                            Show/hide the ClipBucket window
                                        </Text>
                                    </Column>
                                    <Row className="settings-screen__shortcut-controls">
                                        {!isEditingToggleShortcut ? (
                                            <>
                                                <div className="settings-screen__shortcut-display">
                                                    <Text size="sm" mono>
                                                        {formatShortcut(toggleShortcut)}
                                                    </Text>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsEditingToggleShortcut(true)
                                                        setTempToggleShortcut(toggleShortcut)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`settings-screen__shortcut-display ${isRecordingToggleShortcut ? 'settings-screen__shortcut-display--recording' : ''}`}
                                                >
                                                    <Text size="sm" mono>
                                                        {isRecordingToggleShortcut
                                                            ? recordedToggleKeys.length > 0
                                                                ? formatShortcut(recordedToggleKeys.join('+'))
                                                                : 'Press keys...'
                                                            : formatShortcut(tempToggleShortcut || toggleShortcut)}
                                                    </Text>
                                                </div>
                                                {!isRecordingToggleShortcut ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={startToggleShortcutRecording}
                                                    >
                                                        Record
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={stopToggleShortcutRecording}
                                                    >
                                                        Stop
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={<CheckIcon size={16} />}
                                                    onClick={confirmToggleShortcutChange}
                                                    disabled={!tempToggleShortcut}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={<XIcon size={16} />}
                                                    onClick={cancelToggleShortcutChange}
                                                />
                                            </>
                                        )}
                                    </Row>
                                </Column>
                            </div>

                            {/* Quick Capture Shortcut */}
                            <div className="settings-screen__shortcut-section">
                                <Column className="settings-screen__shortcut-column">
                                    <Column className="settings-screen__shortcut-info">
                                        <Text weight="medium">Quick Capture</Text>
                                        <Text size="sm" color="muted">
                                            Copy selected text and save to bucket
                                        </Text>
                                    </Column>
                                    <Row className="settings-screen__shortcut-controls">
                                        {!isEditingQuickCaptureShortcut ? (
                                            <>
                                                <div className="settings-screen__shortcut-display">
                                                    <Text size="sm" mono>
                                                        {formatShortcut(quickCaptureShortcut)}
                                                    </Text>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsEditingQuickCaptureShortcut(true)
                                                        setTempQuickCaptureShortcut(quickCaptureShortcut)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`settings-screen__shortcut-display ${isRecordingQuickCaptureShortcut ? 'settings-screen__shortcut-display--recording' : ''}`}
                                                >
                                                    <Text size="sm" mono>
                                                        {isRecordingQuickCaptureShortcut
                                                            ? recordedQuickCaptureKeys.length > 0
                                                                ? formatShortcut(recordedQuickCaptureKeys.join('+'))
                                                                : 'Press keys...'
                                                            : formatShortcut(tempQuickCaptureShortcut || quickCaptureShortcut)}
                                                    </Text>
                                                </div>
                                                {!isRecordingQuickCaptureShortcut ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={startQuickCaptureShortcutRecording}
                                                    >
                                                        Record
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={stopQuickCaptureShortcutRecording}
                                                    >
                                                        Stop
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={<CheckIcon size={16} />}
                                                    onClick={confirmQuickCaptureShortcutChange}
                                                    disabled={!tempQuickCaptureShortcut}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={<XIcon size={16} />}
                                                    onClick={cancelQuickCaptureShortcutChange}
                                                />
                                            </>
                                        )}
                                    </Row>
                                </Column>
                            </div>
                        </Column>
                    </Column>
                    <Column className="settings-screen__section">
                        <Text size="lg" weight="semibold">
                            Other Settings
                        </Text>
                        <div className="settings-screen__coming-soon">
                            <Text size="sm" color="muted" align="center">
                                More settings coming soon...
                            </Text>
                        </div>
                    </Column>
                </Column>
            </div>
        </ScreenWrapper>
    )
}
