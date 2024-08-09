import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React from 'react';
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: 'Bearer YOUR_GITHUB_ACCESS_TOKEN',
  },
});

export async function searchRepositories(
  query: string,
  page: number,
  sortBy: 'STARS' | 'FORKS' | 'UPDATED_AT',
  sortDirection: 'ASC' | 'DESC'
) {
  const response = await client.query({
    query: gql`
      query SearchRepositories($query: String!, $page: Int!, $sortBy: RepositoryOrderField!, $sortDirection: OrderDirection!) {
        search(query: $query, type: REPOSITORY, first: 10, after: "${(page - 1) * 10}") {
          repositoryCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ... on Repository {
              name
              description
              license {
                name
              }
              forkCount
              stargazerCount
              updatedAt
              primaryLanguage {
                name
              }
            }
          }
        }
      }
    `,
    variables: {
      query,
      page,
      sortBy,
      sortDirection,
    },
  });

  return response.data.search;
}