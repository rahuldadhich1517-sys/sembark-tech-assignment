import styles from './SkeletonProductCard.module.scss'

export default function SkeletonProductCard() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.imagePlaceholder} />
      <div className={styles.cardBody}>
        <div className={styles.metaPlaceholder} />
        <div className={styles.titlePlaceholder} />
        <div className={styles.footerPlaceholder}>
          <span />
          <span />
        </div>
      </div>
    </article>
  )
}
