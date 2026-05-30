import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProductsForCategories } from '../../api'
import type { Category, Product } from '../../types'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './HomePage.module.scss'

const PRODUCTS_PER_PAGE = 18

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const selectedCategoryIds = useMemo(() => {
    const value = searchParams.get('categories') || ''
    return value
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((id) => Number.isFinite(id) && id > 0)
  }, [searchParams])

  const sort = useMemo(() => {
    const value = searchParams.get('sort') || ''
    return value === 'price-asc' || value === 'price-desc' ? value : ''
  }, [searchParams])

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
    if (sort === 'price-asc') {
      return [...products].sort((a, b) => a.price - b.price)
    }
    if (sort === 'price-desc') {
      return [...products].sort((a, b) => b.price - a.price)
    }
    return products
  }, [products, sort])

  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE))
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

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
    setCurrentPage(1)
  }, [selectedCategoryIds, sort])

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
      <div className={styles.container}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>All products</h1>
            <p className={styles.heroDescription}>
              Filter by category and sort by price. Your selection is reflected in the URL.
            </p>
          </div>
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitle}>Filters</div>
              {(selectedCategoryIds.length > 0 || sort) && (
                <button type="button" className={styles.clearButton} onClick={clearFilters}>
                  Reset filters
                </button>
              )}
            </div>

            <div className={styles.panelSection}>
              <h2 className={styles.panelHeading}>Categories</h2>
              {categories.length === 0 && !error ? (
                <p className={styles.panelMessage}>Loading…</p>
              ) : (
                <ul className={styles.categoryList} data-testid="category-list">
                  {categories.map((category) => {
                    const checked = selectedCategoryIds.includes(category.id)
                    return (
                      <li key={category.id} className={styles.categoryItem}>
                        <label>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(category.id)}
                            className={styles.categoryCheckbox}
                            data-testid={`cat-${category.id}`}
                          />
                          <span>{category.name}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className={styles.panelSection}>
              <h2 className={styles.panelHeading}>Sort by</h2>
              <select
                value={sort}
                onChange={(event) => updateSearchParams({ sort: event.target.value || null })}
                className={styles.sortSelect}
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </aside>

          <section className={styles.productSection}>
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
            ) : loading ? (
              <div className={styles.emptyState}>Loading products…</div>
            ) : paginatedProducts.length ? (
              <>
                <div className={styles.grid}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className={styles.pagination}>
                    <button
                      type="button"
                      className={styles.pageButton}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>

                    <div className={styles.pageList}>
                      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`${styles.pageButton} ${
                            page === currentPage ? styles.pageButtonActive : ''
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={styles.pageButton}
                      disabled={currentPage === pageCount}
                      onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.emptyState}>No products match these filters.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
