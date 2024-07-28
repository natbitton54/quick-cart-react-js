import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/actions/cartActions.js';

import 'swiper/swiper-bundle.css';
import './home.css';
import slide1 from '../../assets/banners/slider-1.png';
import slide2 from '../../assets/banners/slider-2.png';
import slide3 from '../../assets/banners/slider-3.png';
import nike from '../../assets/brands/nike.jpg';
import adidas from '../../assets/brands/adidas.png';
import newBalance from '../../assets/brands/newBalance.png';
import puma from '../../assets/brands/puma.png';
import reebok from '../../assets/brands/rebook.png';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faShippingFast, faUndo } from '@fortawesome/free-solid-svg-icons';
import 'boxicons/css/boxicons.min.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// import skeleton loader css
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';

export default function Home() {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [lowestResaleProducts, setLowestResaleProducts] = useState([]);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function removeYearFromShoeName(shoeName) {
    // Regex to remove multiple years and other edge cases at the end of the string
    return shoeName.replace(/(\s*\(\d{4}(\/\d{4})?\)|\s*\[\d{4}(\/\d{4})?\]|\s*\d{4}(\/\d{4})?)$/, '');
  }

  useEffect(() => {
    async function fetchMostPopularProducts() {
      try {
        const res = await axios.get('https://quick-cart-react-js-server.vercel.app/api/mostPopular');
        const filteredProducts = res.data.filter((_, index) => (
          index !== 6 && index !== 5 && index !== 8 && index !== 9
        ));
        setBestSellingProducts(filteredProducts);
      } catch (err) {
        toast.error('Failed to fetch best-selling products');
        console.error('Error fetching best-selling products:', err);
      }
    }

    async function fetchLowestResaleProducts() {
      try {
        const res = await axios.get('https://quick-cart-react-js-server.vercel.app/api/lowestResale');
        setLowestResaleProducts(res.data);
      } catch (err) {
        toast.error('Failed to fetch products with low resale prices');
        console.error('Error fetching low resale products:', err);
      }
    }

    fetchMostPopularProducts();
    fetchLowestResaleProducts();
  }, []);

   const handleAddToCart = (product) => { 
    if(!isLoggedIn){
      toast.error("Please log in or sign-up to add items to the cart.")
      navigate('/login')
    } else{
      dispatch(addToCart(product))
    }
  }

  useEffect(() => {
    document.title = "QuickCart"
  },[])

  return (
    <>
      <div className="slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="mySlider"
        >
          {[slide1, slide2, slide3].map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <img src={slide} alt={`Slide ${index + 1}`} style={{ height: '720px', width: '100%' }} />
                <div className="text-content">
                  <h4>{['Step Up Your Style', 'Runway Ready', 'Classic Charm'][index]}</h4>
                  <h2>{['Find Your Perfect Pair', 'Elevate Your Game', 'Timeless Elegance'][index]} <br /> {['Exquisite Footwear Awaits', 'With a wide variety of shoes', 'Meet Modern Comfort'][index]}</h2>
                  <Link to="/products" className="primary-button">{['Discover More', 'Shop now', 'Explore Classics'][index]}</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="brands-container">
        <div className="brands-wrapper">
          {[nike, adidas, puma, reebok, newBalance].map((brand, index) => (
            <div className="brand-item" key={index}>
              <Link to="/products"><img src={brand} alt={['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'][index]} width={150} /></Link>
            </div>
          ))}
        </div>
      </div>

      <section className="product">
        <h2 className="product-category">Best Selling</h2>
        <div className="product-container" id="bestSellingContainer">
          {bestSellingProducts.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Skeleton height={300} width={210} />
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={510}
              navigation={true}
              className="productSlider"
            >
              {bestSellingProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="product-card-slide">
                    <div>
                      <img src={product.thumbnail} alt={product.shoeName} className="product-thumb" />
                    </div>
                    <div className="product-info">
                      <h2 className="product-brand">{product.brand}</h2>
                      <p className="product-short-description">{removeYearFromShoeName(product.shoeName)}</p>
                      <span className="price">${product.lowestResellPrice?.stockX}</span>
                    </div>
                    <button className="card-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>


      <div className="container">
        <div className="product-header">
          <h1>Popular Items</h1>
          <p>Browse the trends our customers love most for the season’s top picks.</p>
        </div>
        <div className="card-layout" id="popularProductsContainer">
          {lowestResaleProducts.length === 0 ? (
            Array(10).fill(0).map((_, index) => (
              <Skeleton key={index} height={300} width={210} count={1} style={{ margin: '10px' }} />
            ))
          ) : lowestResaleProducts.length > 0 ? (
            lowestResaleProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="card">
                  <div className="img-container">
                    <img src={product.thumbnail} alt={product.shoeName} />
                    <div className="overlay">
                      <button className="overlay-icon" id="heart"><i className="far fa-heart"></i></button>
                      <button className="overlay-icon" id="shop">QUICK SHOP</button>
                      <button className="overlay-icon" id="rng"><i className="fa fa-random"></i></button>
                    </div>
                  </div>
                  <div className="color">
                    <div className="yellow"></div>
                    <div className="grey"></div>
                    <div className="pink"></div>
                    <div className="red"></div>
                    <div className="one">+1</div>
                  </div>
                  <p className='card-desc'>{product.shoeName}</p>

                  <div className="star">
                    <i className="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>

                </div>
                <p className='price-p'>${product.lowestResellPrice?.stockX}</p>

                <button className='cart-btn' id='add=to-cart' onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      <div className="services-section">
        <div className="service-item">
          <FontAwesomeIcon icon={faShippingFast} className="service-icon" />
          <h3>Free Shipping</h3>
          <p>All orders qualify for free shipping.</p>
        </div>
        <div className="service-item">
          <FontAwesomeIcon icon={faLock} className="service-icon" />
          <h3>Secure Checkout</h3>
          <p>Our payment gateway is completely secure.</p>
        </div>
        <div className="service-item">
          <FontAwesomeIcon icon={faUndo} className="service-icon" />
          <h3>Free Returns</h3>
          <p>Anything you don't like or doesn't fit can be returned!</p>
        </div>
        <div className="service-item">
          <i className='bx bx-badge-check service-icon' style={{ fontSize: '42px' }}></i>
          <h3>Quality Guarantee</h3>
          <p>All our products possess a certificate of authenticity.</p>
        </div>
      </div>
    </>
  );
}
