import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
