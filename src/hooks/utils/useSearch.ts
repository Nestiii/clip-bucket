import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

interface UseSearchOptions<T> {
    data: T[]
    searchFields: (keyof T)[]
    debounceMs?: number
}

export const useSearch = <T extends Record<string, any>>({
                                                             data,
                                                             searchFields,
                                                             debounceMs = 300
                                                         }: UseSearchOptions<T>) => {

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredData, setFilteredData] = useState<T[]>(data || [])

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            if (!term.trim()) {
                setFilteredData(data)
                return
            }

            const filtered = data.filter((item) => {
                const searchLower = term.toLowerCase()
                return searchFields.some(field => {
                    const fieldValue = item[field]
                    return fieldValue?.toString().toLowerCase().includes(searchLower)
                })
            })

            setFilteredData(filtered)
        }, debounceMs),
        [data, searchFields, debounceMs]
    )

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
        debouncedSearch(value)
    }, [debouncedSearch])

    const clearSearch = useCallback(() => {
        setSearchTerm('')
        setFilteredData(data)
        debouncedSearch.cancel()
    }, [data, debouncedSearch])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data)
        } else {
            debouncedSearch(searchTerm)
        }
    }, [data, searchTerm, debouncedSearch])

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    return {
        searchTerm,
        filteredData,
        handleSearchChange,
        clearSearch,
        isSearching: searchTerm.trim().length > 0,
        resultCount: filteredData?.length || 0
    }
}
