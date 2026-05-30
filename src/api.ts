import type { Category, Product } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://api.escuelajs.co/api/v1'
const DEFAULT_RETRY = 2
const CACHE_TTL = 1000 * 60 * 2
const STALE_TTL = 1000 * 60 * 20

type CacheEntry<T> = {
  data: T
  timestamp: number
}

const responseCache = new Map<string, CacheEntry<unknown>>()
const requestCache = new Map<string, Promise<unknown>>()

function getCache<T>(url: string): CacheEntry<T> | undefined {
  return responseCache.get(url) as CacheEntry<T> | undefined
}

function setCache<T>(url: string, data: T) {
  responseCache.set(url, { data, timestamp: Date.now() })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson<T>(url: string, retries = DEFAULT_RETRY): Promise<T> {
  let attempt = 0
  while (attempt <= retries) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`)
      }
      return response.json() as Promise<T>
    } catch (error) {
      attempt += 1
      if (attempt > retries) {
        throw error
      }
      await sleep(250 * attempt)
    }
  }
  throw new Error('Unable to complete request')
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = getCache<T>(url)
  const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL
  const isStale = cached && Date.now() - cached.timestamp < STALE_TTL

  if (isFresh && cached) {
    return cached.data
  }

  const existingRequest = requestCache.get(url)
  if (existingRequest) {
    return existingRequest as Promise<T>
  }

  const request = fetchJson<T>(url)
    .then((result) => {
      setCache(url, result)
      requestCache.delete(url)
      return result
    })
    .catch((error) => {
      requestCache.delete(url)
      if (cached) {
        return cached.data
      }
      throw error
    })

  requestCache.set(url, request)

  if (isStale && cached) {
    request.catch(() => {})
    return cached.data
  }

  return request
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchWithCache<Category[]>(`${API_BASE}/categories`)
}

export async function fetchProductById(id: string): Promise<Product> {
  return fetchWithCache<Product>(`${API_BASE}/products/${id}`)
}

export async function fetchProductsByCategory(categoryId: number, limit = 50): Promise<Product[]> {
  return fetchWithCache<Product[]>(`${API_BASE}/products?categoryId=${categoryId}&limit=${limit}`)
}

export async function fetchProducts(limit = 100): Promise<Product[]> {
  return fetchWithCache<Product[]>(`${API_BASE}/products?limit=${limit}`)
}

export async function fetchProductsForCategories(categoryIds: number[]): Promise<Product[]> {
  if (categoryIds.length === 0) {
    return fetchProducts()
  }

  const requests = categoryIds.map((categoryId) => fetchProductsByCategory(categoryId, 100))
  const results = await Promise.all(requests)
  const uniqueProducts = new Map<number, Product>()

  results.flat().forEach((product) => {
    uniqueProducts.set(product.id, product)
  })

  return Array.from(uniqueProducts.values())
}
