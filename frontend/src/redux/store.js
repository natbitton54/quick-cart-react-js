import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import {thunk} from 'redux-thunk';
import cartReducer from './reducers/cartReducer';


const rootReducer = combineReducers({
    cart: cartReducer,
});

const rememberMe = localStorage.getItem('rememberMe') === 'true';

const persistConfig = {
    key: 'root',
    storage: rememberMe ? storage : sessionStorage,
    whitelist: ['cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
