import {combineReducers, configureStore} from '@reduxjs/toolkit'
import authSlice from './AuthSlice.jsx'
import postSlice from './PostSlice.jsx'
import socketSlice from './SocketSlice.jsx'
import chatSlice from './ChatSlice.jsx'
import {persistReducer,persistCombineReducers, PAUSE,REGISTER,REHYDRATE,FLUSH,PURGE,PERSIST} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version:1,
    storage
  };
  
  const rootReducers = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chatio:chatSlice,
  });

const _persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
    // {
    //   /* ignore persistance actions */
    //   ignoredActions: [
    //     FLUSH,
    //     REHYDRATE,
    //     PAUSE,
    //     PERSIST,
    //     PURGE,
    //     REGISTER
    //   ],
    // },
  }),
});

export default store;