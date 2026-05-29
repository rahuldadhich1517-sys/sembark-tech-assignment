import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProductsForCategories } from '../api'
import type { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'

const pageStyle: CSSProperties = {
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 18,
}

const filterPanel: CSSProperties = {
  display: 'grid',
  gap: 16,
  borderRadius: 18,
  padding: 20,
  background: '#fff',
  boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
}

const controlsRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
}

const buttonStyle: CSSProperties = {
  borderRadius: 999,
  border: '1px solid #d1d5db',
  padding: '10px 16px',
  background: '#f8fafc',
  cursor: 'pointer',
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedCategoryIds = useMemo(() => {
    const value = searchParams.get('categories') || ''
    return value
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((id) => Number.isFinite(id) && id > 0)
  }, [searchParams])

  const sort = searchParams.get('sort') || 'default'

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('Unable to load categories.'))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProductsForCategories(selectedCategoryIds)
      .then((result) => {
        setProducts(result)
      })
      .catch(() => setError('Unable to load products.'))
      .finally(() => setLoading(false))
  }, [selectedCategoryIds])

  const sortedProducts = useMemo(() => {
    if (sort === 'price_asc') {
      return [...products].sort((a, b) => a.price - b.price)
    }
    if (sort === 'price_desc') {
      return [...products].sort((a, b) => b.price - a.price)
    }
    return products
  }, [products, sort])

  const updateSearchParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (value == null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    setSearchParams(params, { replace: true })
  }

  const toggleCategory = (categoryId: number) => {
    const nextSelected = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId]
    updateSearchParams({ categories: nextSelected.length ? nextSelected.join(',') : null })
  }

  const clearFilters = () => {
    updateSearchParams({ categories: null, sort: null })
  }

  return (
    <main style={pageStyle}>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 36 }}>Product Listing</h1>
            <p style={{ margin: '12px 0 0', color: '#4b5563', maxWidth: 560 }}>
              Browse trending products, filter by category, and sort prices. The product selection is preserved in the URL.
            </p>
          </div>
          <div style={controlsRow}>
            <button type="button" style={buttonStyle} onClick={clearFilters}>
              Reset filters
            </button>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', padding: '10px 14px', borderRadius: 12, border: '1px solid #d1d5db' }}>
              Sort
              <select
                value={sort}
                onChange={(event) => updateSearchParams({ sort: event.target.value || null })}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600 }}
                data-cy="sort-select"
              >
                <option value="default">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 20 }}>
        <div style={filterPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>Categories</h2>
            <span style={{ color: '#6b7280' }}>{selectedCategoryIds.length} selected</span>
          </div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {categories.map((category) => {
              const active = selectedCategoryIds.includes(category.id)
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    textAlign: 'left',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: `1px solid ${active ? '#2563eb' : '#d1d5db'}`,
                    background: active ? '#eff6ff' : '#fff',
                    color: '#111827',
                    cursor: 'pointer',
                  }}
                  data-cy={`category-${category.id}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{category.name}</span>
                    {active ? <strong style={{ color: '#2563eb' }}>✓</strong> : null}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                {loading ? 'Loading products...' : `${sortedProducts.length} products found`}
              </h2>
              <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
                {selectedCategoryIds.length
                  ? 'Filtered by category. Share the link to preserve your selection.'
                  : 'Showing all available products.'}
              </p>
            </div>
          </div>
          {error ? (
            <p style={{ color: '#dc2626', marginTop: 16 }}>{error}</p>
          ) : (
            <div style={{ marginTop: 16 }}>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <div style={gridStyle}>{sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
