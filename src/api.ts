import type { Category, Product } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.json()
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${API_BASE}/categories`)
}

export async function fetchProductById(id: string): Promise<Product> {
  return fetchJson<Product>(`${API_BASE}/products/${id}`)
}

export async function fetchProductsByCategory(categoryId: number, limit = 50): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_BASE}/products?categoryId=${categoryId}&limit=${limit}`)
}

export async function fetchProducts(limit = 100): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_BASE}/products?limit=${limit}`)
}

export async function fetchProductsForCategories(categoryIds: number[]): Promise<Product[]> {
  if (categoryIds.length === 0) {
    return fetchProducts()
  }

  const results = await Promise.all(
    categoryIds.map((categoryId) => fetchProductsByCategory(categoryId, 100)),
  )

  const uniqueProducts = new Map<number, Product>()
  results.flat().forEach((product) => {
    uniqueProducts.set(product.id, product)
  })

  return Array.from(uniqueProducts.values())
}
