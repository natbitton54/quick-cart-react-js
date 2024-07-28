const initialState = {
    isLoggedIn: false,
    user: {}
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                user: {}
            };
        default:
            return state;
    }
};

export default authReducer
