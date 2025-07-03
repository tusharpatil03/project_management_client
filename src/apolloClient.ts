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

const BACKEND_URL = import.meta.env.BACKEND_URL;

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('accessToken');
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
                            const accessToken =
                                localStorage.getItem('accessToken');
                            operation.setContext({
                                headers: {
                                    ...oldHeaders,
                                    authorization: 'Bearer ' + accessToken,
                                },
                            });
                            return forward(operation);
                        } else {
                            localStorage.clear();
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
