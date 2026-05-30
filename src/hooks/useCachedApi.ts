import { useEffect, useMemo, useRef, useState } from 'react'

type CacheEntry<Data> = {
  data: Data
  timestamp: number
}

type ApiOptions = {
  staleTime?: number
  cacheTime?: number
  retry?: number
  enabled?: boolean
  initialData?: unknown
}

type ApiState<ApiStateType> = {
  data: ApiStateType | undefined
  error: string | null
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
}

export type { ApiState }

const responseCache = new Map<string, CacheEntry<unknown>>()
const requestCache = new Map<string, Promise<unknown>>()

function getCache<GetCache>(key: string): CacheEntry<GetCache> | undefined {
  return responseCache.get(key) as CacheEntry<GetCache> | undefined
}

function setCache<SetCache>(key: string, data: SetCache): void {
  responseCache.set(key, { data, timestamp: Date.now() })
}

function isCacheFresh(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl
}

async function retryFetch<RetryFetch>(fetcher: () => Promise<RetryFetch>, retries: number): Promise<RetryFetch> {
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

function loadRequest<LoadRequest>(key: string, fetcher: () => Promise<LoadRequest>): Promise<LoadRequest> {
  const inFlight = requestCache.get(key)
  if (inFlight) {
    return inFlight as Promise<LoadRequest>
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

export function useCachedApi<UseCachedApi>(cacheKey: string, fetcher: () => Promise<UseCachedApi>, options: ApiOptions = {}): ApiState<UseCachedApi> {
  const { staleTime = 1000 * 60 * 2, cacheTime = 1000 * 60 * 20, retry = 2, enabled = true, initialData } = options
  const cacheEntry = getCache<UseCachedApi>(cacheKey)
  const initialValue = useMemo(() => {
    if (initialData !== undefined) {
      return initialData as UseCachedApi
    }
    return cacheEntry?.data
  }, [cacheEntry, initialData])

  const [data, setData] = useState<UseCachedApi | undefined>(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(initialValue === undefined)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const hasLoadedRef = useRef(false)

  const fetchData = async (): Promise<void> => {
    if (!enabled) return

    setIsFetching(true)
    setError(null)

    try {
      const result = await loadRequest(cacheKey, () => retryFetch(fetcher, retry))
      setData(result)
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
    if (!enabled) return

    const entry = getCache<UseCachedApi>(cacheKey)
    const hasFreshData = entry && isCacheFresh(entry.timestamp, staleTime)
    const hasStaleData = entry && isCacheFresh(entry.timestamp, cacheTime)

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

  const refetch = (): void => {
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
