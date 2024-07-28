import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateItemQuantity } from '../../redux/actions/cartActions';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const navigate = useNavigate();

  const proceedToCheckout = async () => {
    const stripe = await stripePromise;

    try {
      const res = await fetch('https://quick-cart-react-js-server.vercel.app/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const session = await res.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error('Error', err);
    }
  };

  useEffect(() => {
    document.title = "Cart";
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.lowestResellPrice?.stockX ? parseFloat(item.lowestResellPrice.stockX).toFixed(2) : '0.00';
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <main className="cart">
      <div className="link-position">
        <p>
          <Link to="/">Home</Link> / <Link to="/cart">Cart</Link>
        </p>
        <h2 className="cart-h2">Shopping Cart</h2>
      </div>

      <div className="cart-container">
        <h1 className="cart-h1">Shopping Cart</h1>
        <hr style={{ backgroundColor: '#aaa' }} />
        <div id="cart-items">
          {cartItems.length > 0 ? cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.thumbnail} alt={item.shoeName} className="product-image" />
              <div className="item-details">
                <div className="name-container">
                  <p className="product-title">{item.shoeName}</p>
                </div>
                <p className="product-price">${item.lowestResellPrice?.stockX ? parseFloat(item.lowestResellPrice.stockX).toFixed(2) : '0.00'}</p>
                <div className="quantity-container">
                  <label htmlFor={`quantity-${item._id}`} className="quantity-label">Quantity:</label>
                  <input
                    type="number"
                    id={`quantity-${item._id}`}
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) => dispatch(updateItemQuantity(item._id, parseInt(e.target.value)))}
                    min="1"
                  />
                </div>
                <button className="remove-btn" onClick={() => dispatch(removeFromCart(item._id))}>Remove</button>
              </div>
            </div>
          )) : <h1 className='cart-empty'>Your cart is empty!</h1>}
        </div>
        <div className="cart-summary">
          <p style={{ marginBottom: '10px', fontWeight: '500' }}>Subtotal: <span id="total-amount">${calculateTotal()}</span></p>
          <button onClick={proceedToCheckout} disabled={cartItems.length === 0} id='checkout-button'>Proceed to Checkout</button>
        </div>
      </div>
    </main>
  );
}
