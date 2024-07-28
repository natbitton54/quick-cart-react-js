import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearCart } from '../../redux/actions/cartActions'
import './stripe-success.css';

export default function StripeSuccess() {
  const [orderDetails, setOrderDetails] = useState({ orderNumber: '', totalAmount: 0, delivery: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const query = new URLSearchParams(location.search)
      const sessionId = query.get('session_id')
      if (!sessionId) {
        navigate('/')
        return
      }

      try {
        const res = await fetch(`https://quick-cart-react-js-server.vercel.app/api/retrieve-checkout-session/${sessionId}`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        setOrderDetails({ orderNumber: data.orderNumber, totalAmount: data.totalAmount, delivery: data.delivery })

        // clear cart after successful payment
        await fetch('http://localhost:3000/api/clear-cart', {
          method: 'POST'
        })
        dispatch(clearCart())
      } catch (err) {
        console.error(`Error fetching session details`, err)
      }
    }

    fetchSessionDetails()
  }, [location.search, navigate, dispatch])

  const handleContinueShopping = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className='success-container'>
      <div className="success-message">
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <p>You will receive an email confirmation shortly.</p>
        <button className="home-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>Order Number: <strong>#{orderDetails.orderNumber}</strong></p>
        <p>Total Amount: <strong>${orderDetails.totalAmount.toFixed(2)}</strong></p>
        <p>Estimated Delivery: <strong>{orderDetails.delivery}</strong></p>
      </div>
    </div>
  )
}
