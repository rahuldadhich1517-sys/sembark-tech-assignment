import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import styles from './CartPage.module.scss'

export default function CartPage() {
  const { cartItems, totalAmount, removeFromCart, addToCart, updateQuantity } = useCart()

  usePageMetadata({
    title: 'Your Cart',
    description: 'Review the products in your cart with fast quantity updates and local persistence.',
  })

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Your Cart</h1>
          <p className={styles.pageSubtitle}>Review items, update quantities, and prepare to checkout.</p>
        </div>
        <Link to="/" className={styles.linkButton}>
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <section className={styles.emptySection}>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Browse products, add them to the cart, and your selection will stay saved.</p>
        </section>
      ) : (
        <section className={styles.cartSection}>
          <div className={styles.tableWrapper}>
            <table className={styles.cartTable}>
              <thead className={styles.cartHead}>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product.id} className={styles.cartRow} data-cy="cart-item">
                    <td className={styles.cartCell}>
                      <Link
                        to={`/product/${item.product.id}`}
                        className={styles.productLink}
                        data-cy={`cart-product-link-${item.product.id}`}
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <p className={styles.productName}>{item.product.title}</p>
                          <span className={styles.productCategory}>{item.product.category.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className={styles.cartCell}>${item.product.price.toFixed(2)}</td>
                    <td className={styles.cartCell}>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity === 1}
                          className={styles.quantityButton}
                          aria-label={`Decrease quantity for ${item.product.title}`}
                          data-cy="decrement-cart-item"
                        >
                          -
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(item.product, 1)}
                          className={styles.quantityButton}
                          aria-label={`Increase quantity for ${item.product.title}`}
                          data-cy="increment-cart-item"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className={styles.cartCell}>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className={styles.removeButton}
                        data-cy="remove-cart-item"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.summary}>
            <div>
              <p className={styles.summaryText}>Total cart value</p>
              <strong className={styles.summaryAmount}>${totalAmount.toFixed(2)}</strong>
            </div>
            <button type="button" className={styles.checkoutButton} disabled>
              Checkout coming soon
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
