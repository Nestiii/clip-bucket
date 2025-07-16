import React, { useState, useRef } from 'react'
import styles from './ClipItem.module.css'
import { Input } from '../../common/Input/Input.tsx'
import { Text } from '../../common/Text/Text.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { Textarea } from '../../common/TextArea/TextArea.tsx'
import { CheckIcon, CornersInIcon, CornersOutIcon, PencilIcon, TrashIcon, XIcon } from '@phosphor-icons/react'

export interface ClipItemProps {
    id?: string
    label?: string
    content?: string
    onLabelChange?: (label: string) => void
    onContentChange?: (content: string) => void
    onCopy?: () => void
    onDelete?: () => void
    fullscreen?: boolean
    setFullscreenClip?: () => void
    className?: string
    timestamp?: string
    style?: React.CSSProperties
}

export const ClipItem: React.FC<ClipItemProps> = ({
                                                      id,
                                                      label = '',
                                                      content = '',
                                                      timestamp = '',
                                                      onLabelChange,
                                                      onContentChange,
                                                      onCopy,
                                                      onDelete,
                                                      fullscreen = false,
                                                      setFullscreenClip,
                                                      className,
                                                      style,
                                                  }) => {
    const [localLabel, setLocalLabel] = useState<string>('')
    const [localContent, setLocalContent] = useState<string>(content)
    const [deleteMode, setDeleteMode] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const cancelEdit = () => {
        setLocalLabel('')
        setEditMode(false)
    }

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.target.value
        setLocalLabel(newLabel)
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setLocalContent(newContent)
        onContentChange?.(newContent)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(localContent)
            onCopy?.()
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && editMode) {
            e.preventDefault()
            confirmEdit()
        }
        if (e.key === 'Escape' && editMode) {
            cancelEdit()
        }
    }

    const confirmDelete = () => {
        onDelete?.()
    }

    const confirmEdit = () => {
        onLabelChange?.(localLabel)
        cancelEdit()
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)

        // Just now (< 30 seconds)
        if (diffInSeconds < 30) {
            return 'just now'
        }

        // Seconds ago (30 seconds - 1 minute)
        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`
        }

        // Minutes ago (1 minute - 1 hour)
        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 min ago' : `${diffInMinutes} mins ago`
        }

        // Hours ago (1 hour - 24 hours)
        if (diffInHours < 24) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
        }

        // Days ago (1 day - 7 days)
        if (diffInDays < 7) {
            return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`
        }

        // This week vs last week
        if (diffInDays < 14) {
            return 'last week'
        }

        // Weeks ago (2-4 weeks)
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7)
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
        }

        // Months ago (1-12 months)
        if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30)
            return months === 1 ? '1 month ago' : `${months} months ago`
        }

        // Years ago (1+ years)
        const years = Math.floor(diffInDays / 365)
        if (years === 1) {
            return '1 year ago'
        } else if (years < 5) {
            return `${years} years ago`
        }

        // Very old - show actual date
        return date.toLocaleDateString()
    }

    const classes = [styles.clipItem, fullscreen && styles.fullscreen, (editMode || deleteMode) && styles.editing, className]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes} style={style} id={id}>
            <div className={styles.header}>
                <div className={styles.labelSection}>
                    {editMode ? (
                        <Input
                            value={localLabel}
                            onChange={handleLabelChange}
                            onKeyDown={handleKeyDown}
                            variant={'bordered'}
                            size={'md'}
                            autoFocus
                            fullWidth
                        />
                    ) : (
                        <div className={styles.labelDisplay}>
                            <Text as={'span'} size={'md'} weight={'bold'} truncate>
                                {deleteMode ? 'Delete clip?' : label}
                            </Text>
                        </div>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button
                        icon={fullscreen ? <CornersInIcon size={16} /> : <CornersOutIcon size={16} />}
                        variant={'transparent'}
                        size={'sm'}
                        onClick={setFullscreenClip}
                        title={'Fullscreen'}
                    />
                    <Button
                        icon={(editMode || deleteMode) ? <CheckIcon size={16} /> : <PencilIcon size={16} />}
                        variant={(editMode || deleteMode) ? 'success' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (editMode) confirmEdit()
                            else if (deleteMode) confirmDelete()
                            else {
                                setEditMode(true)
                                setLocalLabel(label)
                            }
                        }}
                        title={'Rename clip'}
                    />
                    <Button
                        icon={(editMode || deleteMode) ? <XIcon size={16} /> : <TrashIcon size={16} />}
                        variant={(editMode || deleteMode) ? 'danger' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (editMode) cancelEdit()
                            else if (deleteMode) setDeleteMode(false)
                            else setDeleteMode(true)
                        }}
                        title={'Delete clip'}
                    />
                </div>
            </div>
            <div
                className={styles.contentDisplay}
                onClick={handleCopy}
                role={'button'}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleCopy()
                    }
                }}
                style={fullscreen ? { height: '100%' } : {}}
            >
                <Textarea
                    ref={textareaRef}
                    value={localContent}
                    onChange={handleContentChange}
                    placeholder={'Paste or type your content here...'}
                    rows={1}
                    variant={'bordered'}
                    resize={'none'}
                    style={fullscreen ? { height: 'calc(100% - 20px)' } : {}}
                />
                {localContent && (
                    <div className={styles.copyHint}>
                        <Text size={'xs'} color={'primary'}>
                            {'Click to copy'}
                        </Text>
                    </div>
                )}
            </div>
            <div className={styles.metadata}>
                {timestamp && (
                    <Text size={'xs'} color={'muted'} weight={'medium'}>
                        {formatTimestamp(timestamp)}
                    </Text>
                )}
                <Text size={'xs'} color={'muted'} weight={'medium'}>
                    {localContent.length} characters
                </Text>
            </div>
        </div>
    )
}
