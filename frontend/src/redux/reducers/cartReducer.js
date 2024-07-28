const initialState = {
    items: [],
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.items.findIndex((item) => item._id === action.payload._id);
            if (existingItemIndex > -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += 1;
                return { ...state, items: updatedItems };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter((item) => item._id !== action.payload) };
        case 'UPDATE_ITEM_QUANTITY':
            return {
                ...state,
                items: state.items.map((item) =>
                    item._id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'SET_CART_ITEMS':
            return { ...state, items: action.payload };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export default cartReducer;
