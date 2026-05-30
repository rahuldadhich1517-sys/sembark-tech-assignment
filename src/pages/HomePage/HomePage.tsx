import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProductsForCategories } from '../../api'
import type { Category, Product } from '../../types'
import ProductCard from '../../components/ProductCard/ProductCard'
import SkeletonProductCard from '../../components/SkeletonProductCard/SkeletonProductCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { useCachedApi } from '../../hooks/useCachedApi'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import styles from './HomePage.module.scss'

const PRODUCTS_PER_PAGE = 18

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
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

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCachedApi<Category[]>('categories', fetchCategories, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  })

  const productsKey = `products-${selectedCategoryIds.join(',')}`
  const fetchProducts = useCallback(
    () => fetchProductsForCategories(selectedCategoryIds),
    [selectedCategoryIds],
  )

  const {
    data: products = [],
    error: productsError,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useCachedApi<Product[]>(productsKey, fetchProducts, {
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 15,
  })

  usePageMetadata({
    title: 'All products',
    description: 'Discover premium products with category filtering, smart caching, and responsive browsing.',
  })

  const loading = categoriesLoading || productsLoading
  const error = categoriesError || productsError

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

  const toggleCategory = (categoryId: number) => {
    const nextSelected = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId]
    updateSearchParams({ categories: nextSelected.length ? nextSelected.join(',') : null })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    updateSearchParams({ categories: null, sort: null })
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [sort])

  return (
    <main className={`${styles.page} ${styles.pageFade}`}>
      <div className={styles.container}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>All products</h1>
            <p className={styles.heroDescription}>
              Filter by category and sort by price. The experience is fast, responsive, and your filters are reflected in the URL.
            </p>
          </div>
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div>
                <p className={styles.sidebarLabel}>Filters</p>
                <h2 className={styles.sidebarTitle}>Refine your search</h2>
              </div>
              {(selectedCategoryIds.length > 0 || sort) && (
                <button type="button" className={styles.clearButton} onClick={clearFilters}>
                  Reset
                </button>
              )}
            </div>

            <div className={styles.panelSection}>
              <h3 className={styles.panelHeading}>Categories</h3>
              {categoriesLoading && !categories.length ? (
                <LoadingSpinner label="Loading categories…" />
              ) : (
                <ul className={styles.categoryList} data-testid="category-list">
                  {categories.map((category) => {
                    const checked = selectedCategoryIds.includes(category.id)
                    return (
                      <li key={category.id} className={styles.categoryItem}>
                        <label className={styles.categoryLabel}>
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
              {categoriesError && <p className={styles.panelMessage}>Unable to load categories.</p>}
            </div>

            <div className={styles.panelSection}>
              <h3 className={styles.panelHeading}>Sort by</h3>
              <select
                value={sort}
                onChange={(event) => updateSearchParams({ sort: event.target.value || null })}
                className={styles.sortSelect}
                aria-label="Sort products"
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
                <p className={styles.resultStatus} aria-live="polite">
                  {productsFetching ? 'Refreshing results…' : 'Filtered results'}
                </p>
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
              <div className={styles.errorPanel} role="alert">
                <p>Unable to load products. Please try again later.</p>
              </div>
            ) : loading && !sortedProducts.length ? (
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }, (_, index) => (
                  <SkeletonProductCard key={index} />
                ))}
              </div>
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
                          aria-current={page === currentPage ? 'page' : undefined}
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
              <div className={styles.emptyState} role="status">
                <p>No products match these filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
