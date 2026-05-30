import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import NavBar from './components/Navbar/NavBar'
import styles from './App.module.scss'

const HomePage = lazy(() => import('./pages/HomePage/HomePage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage/CartPage'))

function App() {
  const location = useLocation()

  return (
    <div className={styles.appRoot}>
      <NavBar />
      <main className={styles.content} key={location.pathname}>
        <ErrorBoundary>
          <Suspense fallback={<p>Loading...</p>}>
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
