import * as ReactDOM from 'react-dom/client';
import './index.css';
import LandingPage from './App.tsx';
import client from './apolloClient.ts';
import { ApolloProvider } from '@apollo/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={client}>
        <LandingPage />
    </ApolloProvider>
);
