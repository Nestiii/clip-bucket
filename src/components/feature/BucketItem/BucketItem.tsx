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
                                                          name,
                                                          onNameChange,
                                                          onDelete,
                                                          onClick,
                                                          className,
                                                          style,
                                                      }) => {
    const [localName, setLocalName] = useState(name)
    const [editMode, setEditMode] = useState(false)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setLocalName(newName)
        onNameChange?.(newName)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && editMode) {
            e.preventDefault()
            setEditMode(false)
        }
    }

    const classes = [styles.bucketItem, editMode && styles.editing, className]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes} style={style} id={id}>
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
                                placeholder={'Enter bucket name...'}
                                variant={'bordered'}
                                size={'md'}
                                autoFocus
                                fullWidth
                            />
                        ) : (
                            <div className={styles.nameDisplay}>
                                <Text as={'h3'} size={'lg'} weight={'semibold'} truncate>
                                    {localName}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button
                        icon={editMode ? <CheckIcon size={16} /> : <PencilIcon size={16} />}
                        variant={editMode ? 'success' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (editMode) {}
                            else setEditMode(true)
                        }}
                        title={'Rename bucket'}
                    />
                    <Button
                        icon={editMode ? <XIcon size={16} /> : <TrashIcon size={16} />}
                        variant={editMode ? 'danger' : 'transparent'}
                        size={'sm'}
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.()
                        }}
                        title={'Delete bucket'}
                    />
                </div>
            </div>
        </div>
    )
}
