import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '../../redux/actions/cartActions';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const storageType = rememberMe ? localStorage : sessionStorage;
        const userUID = rememberMe ? localStorage.getItem('userUID') : sessionStorage.getItem('userUID');
        const storedCartItems = JSON.parse(storageType.getItem(`cart-${userUID}`) || '[]');
        dispatch(setCartItems(storedCartItems));
    }, [dispatch]);

    useEffect(() => {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const storageType = rememberMe ? localStorage : sessionStorage;
        const userUID = rememberMe ? localStorage.getItem('userUID') : sessionStorage.getItem('userUID');
        storageType.setItem(`cart-${userUID}`, JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems }}>
            {children}
        </CartContext.Provider>
    );
};
