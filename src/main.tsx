import * as ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.tsx';
import { AuthProvider } from './contexts/AuthContext';

const fallbackLoader = <div className="loader"></div>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={fallbackLoader}>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </Suspense>
);
