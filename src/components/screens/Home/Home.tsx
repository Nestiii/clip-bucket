import React from 'react'
import styles from './Home.module.css'
import { Column } from '../../common/Column/Column.tsx'
import {mockBucketsData} from '../../../mock/mockBuckets.tsx'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'
import { Input } from '../../common/Input/Input.tsx'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useSearch } from '../../../hooks/useSearch.ts'
import { BucketItem } from '../../feature/BucketItem/BucketItem.tsx'
import { useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {

    const navigate = useNavigate()
    const {filteredData, searchTerm, handleSearchChange, } = useSearch({
        data: mockBucketsData,
        searchFields: ['name'],
        debounceMs: 200
    })

    return (
        <ScreenWrapper>
            <Input
                placeholder={'Search bucket...'}
                rightIcon={<MagnifyingGlassIcon size={16} />}
                style={{marginBottom: '10px'}}
                variant={'bordered'}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Column className={styles.bucketsContainer}>
                {
                    filteredData.map((bucket) => (
                        <BucketItem key={bucket.id} name={bucket.name} onClick={() => navigate('/bucket/' + bucket.id)} />
                    ))
                }
            </Column>
        </ScreenWrapper>
    )
}
