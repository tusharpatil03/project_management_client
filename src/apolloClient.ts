// apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Replace with your GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql/',
});

// Set the Authorization header dynamically
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // or sessionStorage, cookie, etc.

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Combine links and create the client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
