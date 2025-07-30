import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'

const App: React.FC = () => {
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                window.api.hideWindow()
            }
        }

        document.addEventListener('keydown', handleGlobalKeyDown)
        return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    }, [])

    return <RouterProvider router={router} />
}

export default App
