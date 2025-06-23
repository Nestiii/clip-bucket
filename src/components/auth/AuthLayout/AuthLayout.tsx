import React from 'react'
import styles from './AuthLayout.module.css'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../../router/routes.ts'
import { Column } from '../../common/Column/Column.tsx'
import { Navbar } from '../../feature/Navbar/Navbar.tsx'

export const AuthLayout: React.FC = () => {
    // Future: Replace with actual auth check
    const isAuthenticated = true // This will come from auth context/state

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return (
        <Column className={styles.appContainer}>
            <Navbar />
            <Outlet />
        </Column>
    )
}
