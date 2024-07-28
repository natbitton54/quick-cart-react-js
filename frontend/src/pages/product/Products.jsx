import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './products.css';
import '../../pages/home/home.css'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions.js';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Brand logos
import nikeLogo from '../../assets/brands/nike.jpg';
import adidasLogo from '../../assets/brands/adidas.png';
import newBalanceLogo from '../../assets/brands/newBalance.png';
import pumaLogo from '../../assets/brands/puma.png';
import reebokLogo from '../../assets/brands/rebook.png';
import { useAuth } from '../auth/firebase.js';

export default function Products() {
  const [productsByBrand, setProductsByBrand] = useState({
    Nike: [],
    Adidas: [],
    Puma: [],
    Reebok: [],
    NewBalance: []
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

const handleAddToCart = (product) => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      navigate('/login');
    } else {
      dispatch(addToCart(product));
      toast.success("Item added to cart!");
    }
  };

  useEffect(() => {
    document.title = "Products"

    const brands = ["Nike", "Adidas", "Puma", "Reebok", "NewBalance"];

    const fetchProductsByBrand = async () => {
      try {
        const responses = await Promise.all(brands.map(brand =>
          axios.get(`https://quick-cart-react-js-server.vercel.app/api/highestResaleByBrand`, { params: { brand } })
        ));
        const newProductsByBrand = brands.reduce((acc, brand, index) => ({
          ...acc,
          [brand]: responses[index].data
        }), {});
        setProductsByBrand(newProductsByBrand);
      } catch (err) {
        console.error(`Error fetching products:`, err);
        toast.error(`Failed to fetch products`);
      }
    };

    fetchProductsByBrand();
  }, []);

  const brandLogos = {
    Nike: nikeLogo,
    Adidas: adidasLogo,
    Puma: pumaLogo,
    Reebok: reebokLogo,
    NewBalance: newBalanceLogo
  };

  const renderProductCards = (brand, products) => {
    return products.length > 0 ? filterProducts(brand, products).map(product => (
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
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
          </div>

        </div>
        <p className='price-p'>${product.lowestResellPrice?.stockX}</p>

        <button className="cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
      </div>
    )) : <p>No products found.</p>;
  };

  const filterProducts = (brand, products) => {
    if (brand === 'Nike') {
      return products.filter((_, index) => index !== 16 && index !== 15 && index !== 13 && index !== 12);
    } else if (brand === 'Puma') {
      return products.filter((_, index) => index !== 0);
    } else if (brand === 'Reebok') {
      return products.filter((_, index) => index !== 15);
    }
    return products;
  };

  return (
    <main className="products">
      <div className="link-position">
        <p>
          <Link to='/'>Home</Link> / <Link to='/products'>Products</Link>
        </p>
        <h2 className='product-h2'>Products</h2>
      </div>

      <div className="brands">
        <div className="brands-container">
          <div className="brands-wrapper">
            {Object.keys(brandLogos).map(brand => (
              <div className="brand-item" key={brand}>
                <a href={`#${brand}`}><img src={brandLogos[brand]} alt={brand} width='140px' /></a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {Object.keys(productsByBrand).map(brand => (
        <section className='brand-section' id={brand} key={brand}>
          <h1>{brand} Section</h1>
          <div className="card-layout">
            {productsByBrand[brand].length === 0 ? (
              Array(4).fill(0).map((_, index) => (
                <Skeleton key={index} height={300} width={210} className="product-card" />
              ))
            ) : renderProductCards(brand, productsByBrand[brand])}
          </div>
        </section>
      ))}
    </main>
  );
}
