import { useState, useCallback, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

interface UseSearchOptions<T> {
    data: T[]
    searchFields: (keyof T)[]
    debounceMs?: number
}

export const useSearch = <T>({
    data,
    searchFields,
    debounceMs = 300,
}: UseSearchOptions<T>) => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredData, setFilteredData] = useState<T[]>(data || [])

    const debouncedSearchFn = useMemo(
        () => debounce((term: string) => {
            if (!term.trim()) {
                setFilteredData(data)
                return
            }

            const filtered = data.filter((item) => {
                const searchLower = term.toLowerCase()
                return searchFields.some((field) => {
                    const fieldValue = item[field]
                    if (typeof fieldValue === 'string') {
                        return fieldValue.toLowerCase().includes(searchLower)
                    }
                    if (fieldValue != null) {
                        return String(fieldValue).toLowerCase().includes(searchLower)
                    }
                    return false
                })
            })

            setFilteredData(filtered)
        }, debounceMs),
        [data, searchFields, debounceMs]
    )

    const debouncedSearch = useCallback(
        (term: string) => debouncedSearchFn(term),
        [debouncedSearchFn]
    )

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value)
            debouncedSearch(value)
        },
        [debouncedSearch]
    )

    const clearSearch = useCallback(() => {
        setSearchTerm('')
        setFilteredData(data)
        debouncedSearchFn.cancel()
    }, [data, debouncedSearchFn])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data)
        } else {
            debouncedSearch(searchTerm)
        }
    }, [data, searchTerm, debouncedSearch])

    useEffect(() => {
        return () => {
            debouncedSearchFn.cancel()
        }
    }, [debouncedSearchFn])

    return {
        searchTerm,
        filteredData,
        handleSearchChange,
        clearSearch,
        isSearching: searchTerm.trim().length > 0,
        resultCount: filteredData?.length || 0,
    }
}
