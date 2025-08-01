import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Row } from '../../common/Row/Row.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { ArrowLeftIcon, GearSixIcon } from '@phosphor-icons/react'
import { Text } from '../../common/Text/Text.tsx'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../../router/routes.ts'
import { useAutoNavigation } from '../../../hooks/utils/useAutoNavigation.ts'
import packageJson from '../../../../package.json'

export const Navbar: React.FC = () => {
    const { bucketId } = useParams<{ bucketId: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const [bucketName, setBucketName] = useState<string>('')
    const { isAutoNavigating } = useAutoNavigation()

    const isBucket = Boolean(bucketId)
    const isHome = location.pathname === '/'
    const isSettings = location.pathname === '/settings'

    useEffect(() => {
        if (Boolean(bucketId) && typeof bucketId === 'string') {
            window.api.getBucketName(bucketId).then((r) => {
                setBucketName(r || '')
            })
        }
    }, [bucketId])

    if (isAutoNavigating) return null

    return (
        <Row className="nav-container">
            {(isBucket || isSettings) && (
                <Button
                    onClick={() => navigate(ROUTES.ROOT)}
                    variant={'transparent'}
                    icon={<ArrowLeftIcon />}
                    disableTabbing
                />
            )}
            {isHome && (
                <Button
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    variant={'transparent'}
                    icon={<GearSixIcon />}
                    disableTabbing
                />
            )}
            <Text weight={'bold'}>
                {isBucket && bucketName}
                {isHome && 'Clip Bucket'}
                {isSettings && 'Settings'}
            </Text>
            <Text color={'muted'} size={'xs'}>
                v{packageJson.version}
            </Text>
        </Row>
    )
}
