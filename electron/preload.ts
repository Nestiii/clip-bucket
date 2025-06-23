import { ipcRenderer, contextBridge } from 'electron'

// Define types for our API
interface ClipboardData {
    buckets: Record<string, string[]>
    currentClipboard: string
}

interface ClipboardAPI {
    getData: () => Promise<ClipboardData>
    createBucket: (name: string) => Promise<boolean>
    deleteBucket: (name: string) => Promise<boolean>
    saveToBucket: (bucketName: string) => Promise<boolean>
    copyItem: (text: string) => Promise<void>
    deleteItem: (bucketName: string, index: number) => Promise<boolean>
    onDataUpdate: (
        callback: (event: Electron.IpcRendererEvent, data: ClipboardData) => void
    ) => void
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },
})

// --------- Expose Clipboard Manager API ---------
contextBridge.exposeInMainWorld('api', {
    getData: (): Promise<ClipboardData> => ipcRenderer.invoke('get-data'),

    createBucket: (name: string): Promise<boolean> => ipcRenderer.invoke('create-bucket', name),

    deleteBucket: (name: string): Promise<boolean> => ipcRenderer.invoke('delete-bucket', name),

    saveToBucket: (bucketName: string): Promise<boolean> =>
        ipcRenderer.invoke('save-to-bucket', bucketName),

    copyItem: (text: string): Promise<void> => ipcRenderer.invoke('copy-item', text),

    deleteItem: (bucketName: string, index: number): Promise<boolean> =>
        ipcRenderer.invoke('delete-item', bucketName, index),

    onDataUpdate: (
        callback: (event: Electron.IpcRendererEvent, data: ClipboardData) => void
    ): void => {
        ipcRenderer.on('data-update', callback)
    },
} satisfies ClipboardAPI)

// --------- Type declarations for renderer ---------
declare global {
    interface Window {
        ipcRenderer: Electron.IpcRenderer
        api: ClipboardAPI
    }
}
