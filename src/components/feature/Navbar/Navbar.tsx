import React from 'react'
import styles from './Navbar.module.css'
import { Row } from '../../common/Row/Row.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { ArrowLeftIcon, GearSixIcon } from '@phosphor-icons/react'
import { Text } from '../../common/Text/Text.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../router/routes.ts'

export const Navbar: React.FC = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const isBucket = location.pathname.includes('bucket')
    const isHome = location.pathname === '/'

    return (
        <Row className={styles.navContainer}>
            {
                isBucket &&
                <Button
                    onClick={() => navigate(ROUTES.ROOT)}
                    variant={'transparent'}
                    icon={<ArrowLeftIcon />}
                />
            }
            {
                isHome &&
                <Button
                    onClick={() => null}
                    variant={'transparent'}
                    icon={<GearSixIcon />}
                />
            }
            <Text weight={'bold'}>
                {isBucket && 'Default Bucket'}
                {isHome && 'Clip Bucket'}
            </Text>
            <Text color={'muted'} size={'xs'}>v0.0.0</Text>
        </Row>
    )
}
