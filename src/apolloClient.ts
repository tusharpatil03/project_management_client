// apolloClient.js
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/link-error';
import { refreshToken } from './utils/refreshToken';
import { triggerGlobalLogout } from './utils/logout';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const httpLink = createHttpLink({
  uri: `${BACKEND_URL}`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
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
          refreshToken().then((res) => {
            if (res) {
              const oldHeaders = operation.getContext().headers;
              const accessToken = localStorage.getItem('token');
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: 'Bearer ' + accessToken,
                },
              });
              window.location.replace("/dashboard/projects");
              return forward(operation);
            } else {
              localStorage.clear();
              triggerGlobalLogout();
              window.location.replace("/");
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
