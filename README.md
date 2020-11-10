# @straw-hat/react-query-fetcher

[React Query](https://react-query.tanstack.com/) and [Fetcher](https://github.com/straw-hat-team/fetcher)
integration.

## Usage

First, lets create an example of a some SDK:

```tsx
// my-sdk.ts
import { getResponseBody, Fetcher } from '@straw-hat/fetcher';
import { WithOptions } from '@straw-hat/react-query-fetcher';

export async function fetchTodoList(client: Fetcher, params: WithOptions) {
  const response = await client('/api/todos', {
    method: 'GET',
    signal: params.options.signal,
  });
  return getResponseBody(response);
}
```

Now lets use those SDK operations combine with React Query:

```tsx
import { fetcher } from '@straw-hat/fetcher';
import { baseUrl } from '@straw-hat/fetcher/dist/middlewares/base-url';
import { fetchTodoList } from './my-sdk';

const httpClient = fetcher();

function useTodoList() {
  return useFetcherQuery(httpClient, {
    queryKey: ['todos'],
    endpoint: fetchTodoList,
  });
}
```
