import { useQuery, QueryKey, QueryConfig } from 'react-query';
import { Fetcher } from '@straw-hat/fetcher';

export type WithOptions<T = unknown> = T & {
  options: {
    signal: AbortSignal;
  };
};

export type Endpoint<TParams> = (client: Fetcher<any>, params?: WithOptions<TParams>) => Promise<any>;

export type UseFetcherQueryArgs<TResult, TError, TParams> = {
  queryKey: QueryKey[];
  endpoint: Endpoint<TParams>;
  params?: TParams;
  config?: QueryConfig<TResult, TError>;
};

export function useFetcherQuery<TResult = unknown, TError = unknown, TParams = unknown>(
  client: Fetcher,
  args: UseFetcherQueryArgs<TResult, TError, TParams>
) {
  const params = args.params ?? {};
  return useQuery<TResult, TError>({
    queryKey: [...args.queryKey, params],
    queryFn() {
      const controller = new AbortController();

      const promise = args.endpoint(
        client,
        // @ts-ignore ¯\_(ツ)_/¯
        {
          ...params,
          options: { signal: controller.signal },
        }
      );

      // @ts-ignore
      promise.cancel = () => controller.abort();

      return promise;
    },
    config: args.config,
  });
}
