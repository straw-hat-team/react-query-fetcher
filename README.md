# @straw-hat/react-query-fetcher

[React Query](https://react-query.tanstack.com/) and [Fetcher](https://github.com/straw-hat-team/fetcher)
integration.

## Usage

First, lets create an example of a some SDK:

```tsx
// my-sdk.ts
import { getResponseBody, getRequestBody, Fetcher } from '@straw-hat/fetcher';
import { WithOptions } from '@straw-hat/react-query-fetcher';

export async function fetchTodoList(client: Fetcher, params: WithOptions) {
  const response = await client('/api/todos', {
    method: 'GET',
    signal: params.options.signal,
  });
  return getResponseBody(response);
}

export async function createTodo(client: Fetcher, params: WithOptions) {
  const response = await client('/api/todos', {
    method: 'POST',
    body: getRequestBody(params?.body),
    signal: params?.options?.signal,
  });
  return getResponseBody(response);
}
```

Now lets use those SDK operations combine with React Query:

```tsx
import { fetcher } from '@straw-hat/fetcher';
import { baseUrl } from '@straw-hat/fetcher/dist/middlewares/base-url';
import { useFetcherQuery, useFetcherMutation } from '@straw-hat/react-query-fetcher';
import { fetchTodoList, createTodo } from './my-sdk';

const httpClient = fetcher();

// Create a Query hook
function useTodoList() {
  return useFetcherQuery(httpClient, {
    queryKey: ['todos'],
    endpoint: fetchTodoList,
  });
}

// Create a Mutation hook
function useCreateTodo() {
  return useFetcherMutation(httpClient, {
    endpoint: createTodo,
  })
}
```
