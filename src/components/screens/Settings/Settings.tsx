import React, { useState, useEffect } from 'react'
import styles from './Settings.module.css'
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
    const [shortcut, setShortcut] = useState<string>('CommandOrControl+Shift+P')
    const [isEditingShortcut, setIsEditingShortcut] = useState<boolean>(false)
    const [tempShortcut, setTempShortcut] = useState<string>('')
    const [isRecordingShortcut, setIsRecordingShortcut] = useState<boolean>(false)
    const [recordedKeys, setRecordedKeys] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true)
                const config = await window.api.getConfig()
                if (config) {
                    setWindowSize(config.settings.windowSize || 'medium')
                    setShortcut(
                        config.settings.shortcuts.toggleWindow || 'CommandOrControl+Shift+P'
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

    const startShortcutRecording = () => {
        setIsRecordingShortcut(true)
        setRecordedKeys([])
        setTempShortcut('')
    }

    const stopShortcutRecording = () => {
        setIsRecordingShortcut(false)
        setRecordedKeys([])
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isRecordingShortcut) return
        e.preventDefault()
        const keys: string[] = []
        if (e.ctrlKey || e.metaKey) keys.push('CommandOrControl')
        if (e.shiftKey) keys.push('Shift')
        if (e.altKey) keys.push('Alt')
        if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) {
            keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key)
        }
        setRecordedKeys(keys)
        if (
            keys.length > 0 &&
            !['Control', 'Meta', 'Shift', 'Alt'].includes(keys[keys.length - 1])
        ) {
            setTempShortcut(keys.join('+'))
        }
    }

    const confirmShortcutChange = async () => {
        if (!tempShortcut) return
        try {
            const validation = await window.api.validateShortcut(tempShortcut)
            if (!validation.valid) {
                alert(`Invalid shortcut: ${validation.reason}`)
                return
            }
            const result = await window.api.updateShortcuts({
                toggleWindow: tempShortcut,
            })
            if (result.success) {
                setShortcut(tempShortcut)
                setIsEditingShortcut(false)
                setIsRecordingShortcut(false)
                setTempShortcut('')
                setRecordedKeys([])
                console.log('Shortcut updated successfully')
            } else {
                alert('Failed to update shortcut')
            }
        } catch (error) {
            console.error('Error updating shortcut:', error)
            alert('Error updating shortcut')
        }
    }

    const cancelShortcutChange = () => {
        setIsEditingShortcut(false)
        setIsRecordingShortcut(false)
        setTempShortcut('')
        setRecordedKeys([])
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
            <div className={styles.settingsContainer} onKeyDown={handleKeyDown} tabIndex={0}>
                <Column className={styles.mainColumn}>
                    <Column className={styles.sectionColumn}>
                        <Row className={styles.sectionHeader}>
                            <Text size="lg" weight="semibold">
                                Window Size
                            </Text>
                        </Row>
                        <Column className={styles.optionsColumn}>
                            {WINDOW_SIZE_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    className={`${styles.settingOption} ${windowSize === option.value ? styles.selected : ''}`}
                                    onClick={() => handleWindowSizeChange(option.value)}
                                >
                                    <Row className={styles.optionRow}>
                                        <Column className={styles.optionContent}>
                                            <Text weight="medium">{option.label}</Text>
                                            <Text size="sm" color="muted">
                                                {option.description}
                                            </Text>
                                        </Column>
                                        <div className={styles.radioButton}>
                                            {windowSize === option.value && (
                                                <div className={styles.radioButtonSelected} />
                                            )}
                                        </div>
                                    </Row>
                                </div>
                            ))}
                        </Column>
                    </Column>
                    <Column className={styles.sectionColumn}>
                        <Row className={styles.sectionHeader}>
                            <Text size="lg" weight="semibold">
                                Keyboard Shortcuts
                            </Text>
                        </Row>
                        <div className={styles.shortcutSection}>
                            <Column className={styles.shortcutColumn}>
                                <Column className={styles.shortcutInfo}>
                                    <Text weight="medium">Toggle Window</Text>
                                    <Text size="sm" color="muted">
                                        Show/hide the ClipBucket window
                                    </Text>
                                </Column>
                                <Row className={styles.shortcutControls}>
                                    {!isEditingShortcut ? (
                                        <>
                                            <div className={styles.shortcutDisplay}>
                                                <Text size="sm" mono>
                                                    {formatShortcut(shortcut)}
                                                </Text>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditingShortcut(true)
                                                    setTempShortcut(shortcut)
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={`${styles.shortcutDisplay} ${isRecordingShortcut ? styles.recording : ''}`}
                                            >
                                                <Text size="sm" mono>
                                                    {isRecordingShortcut
                                                        ? recordedKeys.length > 0
                                                            ? formatShortcut(recordedKeys.join('+'))
                                                            : 'Press keys...'
                                                        : formatShortcut(tempShortcut || shortcut)}
                                                </Text>
                                            </div>
                                            {!isRecordingShortcut ? (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={startShortcutRecording}
                                                >
                                                    Record
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={stopShortcutRecording}
                                                >
                                                    Stop
                                                </Button>
                                            )}
                                            <Button
                                                variant="success"
                                                size="sm"
                                                icon={<CheckIcon size={16} />}
                                                onClick={confirmShortcutChange}
                                                disabled={!tempShortcut}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                icon={<XIcon size={16} />}
                                                onClick={cancelShortcutChange}
                                            />
                                        </>
                                    )}
                                </Row>
                            </Column>
                        </div>
                    </Column>
                    <Column className={styles.sectionColumn}>
                        <Text size="lg" weight="semibold">
                            Other Settings
                        </Text>
                        <div className={styles.comingSoon}>
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
