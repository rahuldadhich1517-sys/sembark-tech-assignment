import { useEffect, useMemo, useRef, useState } from 'react'

type CacheEntry<T> = {
  data: T
  timestamp: number
}

type ApiOptions = {
  staleTime?: number
  cacheTime?: number
  retry?: number
  enabled?: boolean
  initialData?: unknown
}

type ApiState<T> = {
  data: T | undefined
  error: string | null
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
}

const responseCache = new Map<string, CacheEntry<unknown>>()
const requestCache = new Map<string, Promise<unknown>>()

function getCache<T>(key: string): CacheEntry<T> | undefined {
  return responseCache.get(key) as CacheEntry<T> | undefined
}

function setCache<T>(key: string, data: T) {
  responseCache.set(key, { data, timestamp: Date.now() })
}

function isFresh(timestamp: number, ttl: number) {
  return Date.now() - timestamp < ttl
}

async function retryFetch<T>(fetcher: () => Promise<T>, retries: number): Promise<T> {
  let attempt = 0
  let lastError: unknown
  while (attempt <= retries) {
    try {
      return await fetcher()
    } catch (error) {
      lastError = error
      attempt += 1
      if (attempt > retries) {
        throw lastError
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt))
    }
  }
  throw lastError
}

function loadRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const inFlight = requestCache.get(key)
  if (inFlight) {
    return inFlight as Promise<T>
  }

  const promise = fetcher()
    .then((value) => {
      requestCache.delete(key)
      setCache(key, value)
      return value
    })
    .catch((error) => {
      requestCache.delete(key)
      throw error
    })

  requestCache.set(key, promise)
  return promise
}

export function useCachedApi<T>(cacheKey: string, fetcher: () => Promise<T>, options: ApiOptions = {}): ApiState<T> {
  const { staleTime = 1000 * 60 * 2, cacheTime = 1000 * 60 * 20, retry = 2, enabled = true, initialData } = options
  const cacheEntry = getCache<T>(cacheKey)
  const initialValue = useMemo(() => {
    if (initialData !== undefined) {
      return initialData as T
    }
    return cacheEntry?.data
  }, [cacheEntry, initialData])

  const [data, setData] = useState<T | undefined>(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(() => !Boolean(initialValue))
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const hasLoadedRef = useRef(false)

  const fetchData = async () => {
    if (!enabled) {
      return
    }

    setIsFetching(true)
    setError(null)

    try {
      const result = await loadRequest(cacheKey, () => retryFetch(fetcher, retry))
      setData(result)
      setError(null)
    } catch (exception) {
      const errorMessage = exception instanceof Error ? exception.message : 'Unknown error'
      setError(errorMessage)
      if (!cacheEntry) {
        setData(undefined)
      }
    } finally {
      setIsFetching(false)
      setIsLoading(false)
      hasLoadedRef.current = true
    }
  }

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const entry = getCache<T>(cacheKey)
    const hasFreshData = entry && isFresh(entry.timestamp, staleTime)
    const hasStaleData = entry && isFresh(entry.timestamp, cacheTime)

    if (entry) {
      setData(entry.data)
      setIsLoading(false)
    }

    if (!entry || !hasFreshData) {
      if (hasStaleData) {
        fetchData().catch(() => {})
      } else {
        setIsLoading(true)
        fetchData().catch(() => {})
      }
    }
  }, [cacheKey, enabled, staleTime, cacheTime, retry, fetcher])

  const refetch = () => {
    setIsLoading(true)
    fetchData().catch(() => {})
  }

  return {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  }
}
