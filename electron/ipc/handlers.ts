import { setupDataHandlers } from './dataHandlers.ts'
import { setupBucketHandlers } from './bucketHandlers.ts'
import { setupClipHandlers } from './clipHandlers.ts'
import { setupSearchHandlers } from './searchHandlers.ts'
import { setupConfigHandlers } from './configHandlers.ts'
import { setupClipboardHandlers } from './clipboardHandlers.ts'
import { setupImportExportHandlers } from './importExportHandlers.ts'

export const setupIpcHandlers = (): void => {
    setupDataHandlers()
    setupBucketHandlers()
    setupClipHandlers()
    setupSearchHandlers()
    setupConfigHandlers()
    setupClipboardHandlers()
    setupImportExportHandlers()
}
