// apolloClient.js
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/link-error';
import authManager from './utils/authManager';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface QueuedOperation {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueuedOperation[] = [];

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    } else {
      reject(new Error('Token refresh failed'));
    }
  });

  failedQueue = [];
};

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
      for (const error of graphQLErrors) {
        if (error.message === 'UnauthenticatedError') {
          return new Observable((observer) => {
            if (isRefreshing) {
              failedQueue.push({
                resolve: (token) => {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${token}`,
                    },
                  });

                  const subscriber = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });

                  return subscriber;
                },
                reject: (error) => {
                  observer.error(error);
                },
              });
            } else {
              isRefreshing = true;

              authManager
                .refresh()
                .then((token) => {
                  if (token) {
                    isRefreshing = false;
                    processQueue(null, token);

                    const oldHeaders = operation.getContext().headers;
                    operation.setContext({
                      headers: {
                        ...oldHeaders,
                        authorization: `Bearer ${token}`,
                      },
                    });

                    const subscriber = forward(operation).subscribe({
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    });

                    return subscriber;
                  } else {
                    // Refresh failed
                    isRefreshing = false;
                    const refreshError = new Error('Token refresh failed');
                    processQueue(refreshError);
                    authManager.logout();
                    observer.error(refreshError);
                  }
                })
                .catch((error) => {
                  // Refresh threw an error
                  isRefreshing = false;
                  processQueue(error);
                  authManager.logout();
                  observer.error(error);
                });
            }
          });
        }
      }
    }

    if (networkError) {
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
