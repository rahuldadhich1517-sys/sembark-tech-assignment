import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './CartPage.module.scss'

export default function CartPage() {
  const { cartItems, totalAmount, removeFromCart, addToCart, decreaseQuantity } = useCart()

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Your Cart</h1>
          <p className={styles.pageSubtitle}>Remove items or review the total before checkout.</p>
        </div>
        <Link to="/" className={styles.linkButton}>
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <section className={styles.emptySection}>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Add a product to the cart from the detail page to see it here.</p>
        </section>
      ) : (
        <section className={styles.cartSection}>
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
                    <Link to={`/product/${item.product.id}`} className={styles.productLink} data-cy={`cart-product-link-${item.product.id}`}>
                      <img src={item.product.images[0]} alt={item.product.title} className={styles.productImage} />
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
                        onClick={() => decreaseQuantity(item.product.id)}
                        disabled={item.quantity === 1}
                        className={styles.quantityButton}
                        data-cy="decrement-cart-item"
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.product)}
                        className={styles.quantityButton}
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
          <div className={styles.summary}>
            <p className={styles.summaryText}>Total cart value</p>
            <strong className={styles.summaryAmount}>${totalAmount.toFixed(2)}</strong>
          </div>
        </section>
      )}
    </main>
  )
}
