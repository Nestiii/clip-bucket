import React, { useState } from 'react'
import styles from './Bucket.module.css'
import { Column } from '../../common/Column/Column.tsx'
import { clipItemsTestData } from '../../../mock/mockClipItems.tsx'
import { ClipItem } from '../../feature/ClipItem/ClipItem.tsx'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'
import { Input } from '../../common/Input/Input.tsx'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useSearch } from '../../../hooks/useSearch.ts'

export const Bucket: React.FC = () => {

    const [fullscreenClip, setFullscreenClip] = useState<string>('')
    const {filteredData, searchTerm, handleSearchChange, } = useSearch({
        data: clipItemsTestData,
        searchFields: ['label', 'content'],
        debounceMs: 200
    })

    const clipsContainerClasses = [styles.clipsContainer, fullscreenClip && styles.clipsContainerFullscreen]
        .filter(Boolean)
        .join(' ')

    return (
        <ScreenWrapper>
            {
                !fullscreenClip &&
                <Input
                    placeholder={'Search clip...'}
                    rightIcon={<MagnifyingGlassIcon size={16} />}
                    style={{marginBottom: '10px'}}
                    variant={'bordered'}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            }
            <Column className={clipsContainerClasses}>
                {
                    filteredData.map((item) => {
                        if (fullscreenClip) {
                            if (fullscreenClip === item.id) {
                                return (
                                    <ClipItem
                                        key={item.id}
                                        setFullscreenClip={() => setFullscreenClip(fullscreenClip ? '' : item.id)}
                                        fullscreen
                                        {...item}
                                    />
                                )
                            } else {
                                return null
                            }
                        } else {
                            return (
                                <ClipItem
                                    key={item.id}
                                    setFullscreenClip={() => setFullscreenClip(item.id)}
                                    {...item}
                                />
                            )
                        }
                    })
                }
            </Column>
        </ScreenWrapper>
    )
}
