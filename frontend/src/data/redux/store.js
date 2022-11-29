import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import auth from './auth/reducer';
import chat from './chat/reducer';

const store = configureStore({
  reducer: { auth, chat },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;
