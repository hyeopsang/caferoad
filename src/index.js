import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RefProvider } from './context/RefContext';
import { PersistGate } from 'redux-persist/integration/react';
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <RefProvider>
          <App />
          </RefProvider>
        </QueryClientProvider>
      </PersistGate>     
    </Provider>
);
