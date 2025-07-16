import { createHashRouter } from 'react-router-dom'
import { ROUTES } from './routes.ts'
import { AppErrorBoundary } from '../components/error/AppErrorBoundary/AppErrorBoundary.tsx'
import { AuthLayout } from '../components/auth/AuthLayout/AuthLayout.tsx'
import { Login } from '../components/screens/Login/Login.tsx'
import { Home } from '../components/screens/Home/Home.tsx'
import { Bucket } from '../components/screens/Bucket/Bucket.tsx'
import { Settings } from '../components/screens/Settings/Settings.tsx'

export const router = createHashRouter([
    {
        element: <AppErrorBoundary />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: ROUTES.BUCKET,
                        element: <Bucket />,
                    },
                    {
                        path: ROUTES.SETTINGS,
                        element: <Settings />,
                    },
                ]
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
        ],
    },
])
