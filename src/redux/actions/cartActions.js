export const addToCart = (product) => ({
    type: 'ADD_TO_CART',
    payload: product
});

export const removeFromCart = (productId) => ({
    type: 'REMOVE_FROM_CART',
    payload: productId
});

export const updateItemQuantity = (productId, quantity) => ({
    type: 'UPDATE_ITEM_QUANTITY',
    payload: { productId, quantity }
});

export const setCartItems = (items) => ({
    type: 'SET_CART_ITEMS',
    payload: items
});

export const clearCart = () => ({
    type: 'CLEAR_CART'
});
