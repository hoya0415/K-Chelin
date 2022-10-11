import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './user_reducer';
import book from './book_reducer';
import store from './store_reducer';
import map from './map_reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user,
  book,
  store,
  map,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
