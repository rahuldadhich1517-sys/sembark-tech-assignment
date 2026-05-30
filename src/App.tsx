import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import PageLoader from './components/PageLoader/PageLoader'
import NavBar from './components/Navbar/NavBar'
import styles from './App.module.scss'

const HomePage = lazy(() => import('./pages/HomePage/HomePage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage/CartPage'))

function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist. Use the top navigation to continue.</p>
    </section>
  )
}

function App() {
  const location = useLocation()

  return (
    <div className={styles.appRoot}>
      <NavBar />
      <main className={styles.content} key={location.pathname}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
