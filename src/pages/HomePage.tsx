import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProductsForCategories } from '../api'
import type { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'
import styles from './HomePage.module.scss'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const selectedCategoryIds = useMemo(() => {
    const value = searchParams.get('categories') || ''
    return value
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((id) => Number.isFinite(id) && id > 0)
  }, [searchParams])

  const sort = searchParams.get('sort') || 'default'

  const selectedCategories = useMemo(
    () => categories.filter((category) => selectedCategoryIds.includes(category.id)),
    [categories, selectedCategoryIds],
  )

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('Unable to load categories.'))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProductsForCategories(selectedCategoryIds)
      .then(setProducts)
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
    setSearchParams(params)
  }

  useEffect(() => {
    if (!categoryDropdownOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [categoryDropdownOpen])

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
    <main className={styles.page}>
      <section>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Product Listing</h1>
          </div>
          <div className={styles.controlsRow}>
            <div ref={dropdownRef} className={styles.categoryWrapper}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen((value) => !value)}
                className={styles.categoryButton}
                aria-haspopup="listbox"
                aria-expanded={categoryDropdownOpen}
              >
                <span className={styles.categoryButtonContent}>
                  <span className={styles.categoryButtonLabel}>Categories</span>
                  <span className={styles.categoryButtonText}>
                    {selectedCategoryIds.length ? `${selectedCategoryIds.length} selected` : 'All categories'}
                  </span>
                </span>
                <span>{categoryDropdownOpen ? '▴' : '▾'}</span>
              </button>
              {categoryDropdownOpen ? (
                <div className={styles.categoryDropdown}>
                  {categories.map((category) => {
                    const active = selectedCategoryIds.includes(category.id)
                    return (
                      <label
                        key={category.id}
                        className={`${styles.dropdownItem} ${active ? styles.dropdownItemActive : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleCategory(category.id)}
                          className={styles.dropdownInput}
                        />
                        <span>{category.name}</span>
                      </label>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <label className={styles.filterLabel}>
              Sort
              <select
                value={sort}
                onChange={(event) => updateSearchParams({ sort: event.target.value || null })}
                className={styles.sortSelect}
                data-cy="sort-select"
              >
                <option value="default">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </label>
            <button type="button" className={styles.resetButton} onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.filterPanel}>
          <div className={styles.filterPanelHeader}>
            <div>
              <h2 className={styles.filterTitle}>Categories</h2>
              <p className={styles.filterDescription}>
                Select one or more categories from the dropdown above to filter products instantly.
              </p>
            </div>
            <span className={styles.selectedCount}>{selectedCategoryIds.length} selected</span>
          </div>
          {selectedCategories.length ? (
            <div className={styles.tagRow}>
              {selectedCategories.map((category) => (
                <span key={category.id} className={styles.tag}>
                  {category.name}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.filterEmpty}>
              Choose categories to narrow results. Your selection stays in the URL for refresh, sharing, and browser navigation.
            </p>
          )}
        </div>

        <div>
          <div className={styles.resultsHeader}>
            <div>
              <h2 className={styles.resultsCount}>
                {loading ? 'Loading products...' : `${sortedProducts.length} products found`}
              </h2>
              <p className={styles.resultsNote}>
                {selectedCategoryIds.length
                  ? 'Filtered by category. Share the link to preserve your selection.'
                  : 'Showing all available products.'}
              </p>
            </div>
          </div>
          {error ? (
            <p className={styles.errorText}>{error}</p>
          ) : (
            <div className={styles.resultsWrap}>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <div className={styles.grid}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
