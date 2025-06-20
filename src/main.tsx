import * as ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import './index.css';
import LandingPage from './App.tsx';
import client from './apolloClient.ts';
import { ApolloProvider } from '@apollo/client';


const fallbackLoader = <div className="loader"></div>;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Suspense fallback={fallbackLoader}>
        <ApolloProvider client={client}>
            <LandingPage />
        </ApolloProvider>
    </Suspense>
);
