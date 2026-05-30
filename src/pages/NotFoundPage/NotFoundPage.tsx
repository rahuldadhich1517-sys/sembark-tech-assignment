import styles from '../HomePage/HomePage.module.scss'

export default function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist. Use the top navigation to continue.</p>
    </section>
  )
}
