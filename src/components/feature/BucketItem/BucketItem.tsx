import React, { useState } from 'react'
import styles from './BucketItem.module.css'
import { Input } from '../../common/Input/Input.tsx'
import { Text } from '../../common/Text/Text.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { CheckIcon, PencilIcon, TrashIcon, TrashSimpleIcon, XIcon } from '@phosphor-icons/react'

export interface BucketItemProps {
    id?: string
    name?: string
    onNameChange?: (name: string) => void
    onDelete?: () => void
    onClick?: () => void
    className?: string
    style?: React.CSSProperties
}

export const BucketItem: React.FC<BucketItemProps> = ({
    id,
    name = '',
    onNameChange,
    onDelete,
    onClick,
    className,
    style,
}) => {
    const [localName, setLocalName] = useState<string>('')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [deleteMode, setDeleteMode] = useState<boolean>(false)

    const cancelEdit = () => {
        setLocalName('')
        setEditMode(false)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setLocalName(newName)
    }

    const confirmDelete = () => {
        onDelete?.()
    }

    const confirmEdit = () => {
        onNameChange?.(localName)
        cancelEdit()
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

    const handleWrapperKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !editMode) {
            e.preventDefault()
            onClick?.()
        }
    }

    const classes = [styles.bucketItem, (editMode || deleteMode) && styles.editing, className]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            className={classes}
            style={style}
            id={id}
            tabIndex={0}
            onKeyDown={handleWrapperKeyDown}
        >
            <div className={styles.bucketContent} onClick={!editMode ? onClick : undefined}>
                <div className={styles.iconSection}>
                    <div className={styles.bucketIcon}>
                        <TrashSimpleIcon size={24} />
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.nameSection}>
                        {editMode ? (
                            <Input
                                value={localName}
                                onChange={handleNameChange}
                                onKeyDown={handleKeyDown}
                                variant={'bordered'}
                                size={'md'}
                                autoFocus
                                fullWidth
                            />
                        ) : (
                            <div className={styles.nameDisplay}>
                                <Text as={'h3'} size={'lg'} weight={'semibold'} truncate>
                                    {deleteMode ? 'Delete bucket?' : name}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button
                        icon={
                            editMode || deleteMode ? (
                                <CheckIcon size={16} />
                            ) : (
                                <PencilIcon size={16} />
                            )
                        }
                        variant={editMode || deleteMode ? 'success' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (editMode) confirmEdit()
                            else if (deleteMode) confirmDelete()
                            else {
                                setEditMode(true)
                                setLocalName(name)
                            }
                        }}
                        title={'Rename bucket'}
                        disableTabbing
                    />
                    <Button
                        icon={
                            editMode || deleteMode ? <XIcon size={16} /> : <TrashIcon size={16} />
                        }
                        variant={editMode || deleteMode ? 'danger' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (editMode) cancelEdit()
                            else if (deleteMode) setDeleteMode(false)
                            else setDeleteMode(true)
                        }}
                        title={'Delete bucket'}
                        disableTabbing
                    />
                </div>
            </div>
        </div>
    )
}
