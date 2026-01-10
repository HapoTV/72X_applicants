import { useState, useEffect, useCallback } from 'react'
import { tenderService } from '@/services/tenders'
import type { Tender } from '@/types'

interface UseTendersOptions {
  page?: number
  limit?: number
  industry?: string
  province?: string
  search?: string
  userId?: string
  personalized?: boolean
}

interface UseTendersReturn {
  tenders: Tender[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  refetch: () => void
  setPage: (page: number) => void
  setFilters: (filters: Partial<UseTendersOptions>) => void
}

export function useTenders(options: UseTendersOptions = {}): UseTendersReturn {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(options.page || 1)
  const [filters, setFiltersState] = useState(options)

  const itemsPerPage = options.limit || 20

  const fetchTenders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let result

      if (filters.personalized && filters.userId) {
        result = await tenderService.getTendersByUserIndustries(
          filters.userId,
          currentPage,
          itemsPerPage
        )
      } else {
        result = await tenderService.getTenders(
          currentPage,
          itemsPerPage,
          filters.industry,
          filters.province !== 'all' ? filters.province : undefined,
          filters.search
        )
      }

      if (result.error) {
        setError(result.error)
        setTenders([])
      } else {
        setTenders(result.tenders)
        setTotalCount(result.count || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setTenders([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, itemsPerPage])

  useEffect(() => {
    fetchTenders()
  }, [fetchTenders])

  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const setFilters = useCallback((newFilters: Partial<UseTendersOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return {
    tenders,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    refetch: fetchTenders,
    setPage,
    setFilters
  }
}

export function useTender(tenderId: string) {
  const [tender, setTender] = useState<Tender | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTender = useCallback(async () => {
    if (!tenderId) return

    setLoading(true)
    setError(null)

    try {
      const result = await tenderService.getTenderById(tenderId)
      
      if (result.error) {
        setError(result.error)
        setTender(null)
      } else {
        setTender(result.tender)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setTender(null)
    } finally {
      setLoading(false)
    }
  }, [tenderId])

  useEffect(() => {
    fetchTender()
  }, [fetchTender])

  return {
    tender,
    loading,
    error,
    refetch: fetchTender
  }
}
