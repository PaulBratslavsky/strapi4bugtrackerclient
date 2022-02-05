import { createUploadLink } from 'apollo-upload-client';


import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
} from '@apollo/client';

const cache = new InMemoryCache();
const defaultOptions = { mutate: { errorPolicy: 'all' } };
const httpLink = createUploadLink({ uri: process.env.REACT_APP_API_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    
    const accessToken =
      operation.operationName !== 'LoginMutation' &&
      localStorage.getItem('user-admin')
        ? JSON.parse(localStorage.getItem('user-admin')).token
        : null;

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  });

  return forward(operation);
});

export const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, httpLink),
  defaultOptions,
});