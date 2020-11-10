// @ts-nocheck

import * as React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';
import { useFetcherQuery } from '../../src/index';

const queryCache = new QueryCache();

const wrapper = ({ children }: any) => (
  <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>
);

test('sends the params to the operation', async () => {
  const client = jest.fn();
  const endpoint = jest.fn(async (_fetcher, _params) => ({ data: 'Hello' }));
  const { waitForNextUpdate } = renderHook(
    () =>
      useFetcherQuery(client, {
        queryKey: ['todos'],
        endpoint,
        params: {
          sortBy: 'title',
        },
      }),
    { wrapper }
  );

  await waitForNextUpdate();

  expect(endpoint.mock.calls[0][0]).toEqual(client);
  expect(endpoint.mock.calls[0][1]).toHaveProperty('options.signal');
  expect(endpoint.mock.calls[0][1]).toHaveProperty('sortBy');
});
