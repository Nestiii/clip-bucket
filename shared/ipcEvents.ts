export const IPC_EVENTS = {
    DATA: {
        GET_DATA: 'get-data',
        GET_BUCKET: 'get-bucket',
        GET_BUCKET_STATS: 'get-bucket-stats',
        GET_BUCKET_NAME: 'get-bucket-name',
    },
    BUCKET: {
        CREATE_BUCKET: 'create-bucket',
        UPDATE_BUCKET: 'update-bucket',
        DELETE_BUCKET: 'delete-bucket',
    },
    CLIP: {
        SAVE_TO_BUCKET: 'save-to-bucket',
        ADD_ITEM_TO_BUCKET: 'add-item-to-bucket',
        UPDATE_CLIP: 'update-clip',
        DELETE_CLIP: 'delete-clip',
        COPY_ITEM: 'copy-item',
    },
    SEARCH: {
        SEARCH_BUCKETS: 'search-buckets',
        SEARCH_CLIPS: 'search-clips',
    },
    CONFIG: {
        GET_CONFIG: 'get-config',
        UPDATE_CONFIG: 'update-config',
        SET_LAST_USED_BUCKET: 'set-last-used-bucket',
        GET_LAST_USED_BUCKET: 'get-last-used-bucket',
    },
    CLIPBOARD: {
        GET_CLIPBOARD: 'get-clipboard',
        SET_CLIPBOARD: 'set-clipboard',
        CLEAR_CLIPBOARD: 'clear-clipboard',
    },
    IMPORT_EXPORT: {
        IMPORT_LEGACY_BUCKETS: 'import-legacy-buckets',
        EXPORT_BUCKETS: 'export-buckets',
    },
    RENDERER: {
        DATA_UPDATE: 'data-update',
        BUCKET_UPDATE: 'bucket-update',
        BUCKETS_UPDATE: 'buckets-update',
        BUCKET_DELETED: 'bucket-deleted',
        CLIP_UPDATE: 'clip-update',
        CLIP_DELETED: 'clip-deleted',
        CONFIG_UPDATE: 'config-update',
        STATS_UPDATE: 'stats-update',
    },
    SETTINGS: {
        UPDATE_WINDOW_SIZE: 'update-window-size',
        UPDATE_SHORTCUTS: 'update-shortcuts',
        VALIDATE_SHORTCUT: 'validate-shortcut',
        GET_WINDOW_SIZES: 'get-window-sizes',
    },
}
