import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import { Column } from '../../common/Column/Column.tsx'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'
import { Input } from '../../common/Input/Input.tsx'
import { CheckIcon, MagnifyingGlassIcon, PlusIcon, TrashSimpleIcon, XIcon } from '@phosphor-icons/react'
import { BucketItem } from '../../feature/BucketItem/BucketItem.tsx'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../../hooks/utils/useSearch.ts'
import { useBuckets } from '../../../hooks/api/useBuckets.ts'
import { Row } from '../../common/Row/Row.tsx'
import { Button } from '../../common/Button/Button.tsx'

export const Home: React.FC = () => {
    const navigate = useNavigate()
    const [createBucketMode, setCreateBucketMode] = useState<boolean>(false)
    const [createBucketName, setCreateBucketName] = useState<string>('')
    const { buckets, loading, error, createBucket, deleteBucket, renameBucket } = useBuckets()
    const inputRef = useRef<HTMLInputElement>(null)
    const { filteredData, searchTerm, handleSearchChange } = useSearch({
        data: buckets,
        searchFields: ['name'],
        debounceMs: 300,
    })

    useEffect(() => {
        if (createBucketMode && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }, [createBucketMode])

    const cancelCreateBucket = () => {
        setCreateBucketName('')
        setCreateBucketMode(false)
    }

    const handleCreateBucket = async () => {
        try {
            createBucket(createBucketName.trim()).then(() => {
                cancelCreateBucket()
            })
        } catch (err) {
            alert('Failed to create bucket')
            cancelCreateBucket()
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && createBucketMode && createBucketName.trim()) {
            handleCreateBucket()
        }
        if (e.key === 'Escape' && createBucketMode) {
            cancelCreateBucket()
        }
    }

    if (loading) return null
    if (error) return <div>Error: {error}</div>

    return (
        <ScreenWrapper>
            <Row className="home__header">
                <Input
                    ref={inputRef}
                    placeholder={createBucketMode ? 'Enter bucket name...' : 'Search bucket...'}
                    rightIcon={createBucketMode ? null : <MagnifyingGlassIcon size={16} />}
                    variant={'bordered'}
                    value={createBucketMode ? createBucketName : searchTerm}
                    onChange={(e) => {
                        if (createBucketMode) setCreateBucketName(e.target.value)
                        else handleSearchChange(e.target.value)
                    }}
                    onKeyDown={handleKeyPress}
                    fullWidth
                />
                {createBucketMode && (
                    <Button
                        onClick={handleCreateBucket}
                        variant={'success'}
                        icon={<CheckIcon />}
                        title={'Confirm'}
                        disabled={
                            !createBucketName || buckets.some((b) => b.name === createBucketName)
                        }
                        style={{ height: 36 }}
                    />
                )}
                <Button
                    onClick={() => {
                        if (createBucketMode) cancelCreateBucket()
                        else setCreateBucketMode(true)
                    }}
                    variant={createBucketMode ? 'danger' : 'transparent-bordered'}
                    icon={createBucketMode ? <XIcon /> : <PlusIcon />}
                    title={createBucketMode ? 'Cancel' : 'Create bucket'}
                    style={{ height: 36 }}
                />
            </Row>
            <Column className="home__buckets-container">
                {filteredData.length > 0 ? (
                    filteredData.map((bucket) => (
                        <BucketItem
                            key={bucket.id}
                            name={bucket.name}
                            onClick={() => navigate('/bucket/' + bucket.id)}
                            onNameChange={(name) => renameBucket(bucket.id, name)}
                            onDelete={() => deleteBucket(bucket.id)}
                        />
                    ))
                ) : (
                    <div className="home__empty-state">
                        <TrashSimpleIcon size={48} />
                        <h3>No buckets found</h3>
                        <p>Create your first bucket to get started</p>
                    </div>
                )}
            </Column>
        </ScreenWrapper>
    )
}
