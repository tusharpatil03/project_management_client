// apolloClient.js
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/link-error';
import { refresh } from './utils/refreshToken';
import authManager from './authManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const httpLink = createHttpLink({
  uri: `${BACKEND_URL}`,
});

const authLink = setContext((_, { headers }) => {
  const token = authManager.getAuth();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => {
        if (message == 'UnauthenticatedError') {
          refresh().then((token) => {
            if (token) {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: 'Bearer ' + token,
                },
              });
              window.location.replace('/dashboard/projects');
              return forward(operation);
            } else {
              localStorage.clear();
              authManager.logout();
            }
          });
        }
      });
    } else if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const combinedLink = ApolloLink.from([errorLink, authLink, httpLink]);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: combinedLink,
});

export default client;
