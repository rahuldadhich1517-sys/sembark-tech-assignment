import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './PageLoader.module.scss'

export default function PageLoader() {
  return (
    <div className={styles.loaderPage}>
      <LoadingSpinner label="Preparing the shop..." />
    </div>
  )
}
