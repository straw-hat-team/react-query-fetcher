import { useQuery, useMutation, QueryKey, UseQueryOptions, UseMutationOptions } from 'react-query';
import { Fetcher } from '@straw-hat/fetcher';

export type WithOptions<T = unknown> = T & {
  options?: {
    signal?: AbortSignal;
  };
};

export type Endpoint<TParams> = (client: Fetcher<any>, params?: WithOptions<TParams>) => Promise<any>;

export type UseFetcherQueryArgs<TResult, TError, TParams> = {
  queryKey: QueryKey[];
  endpoint: Endpoint<TParams>;
  params?: TParams;
  options?: UseQueryOptions<TResult, TError>;
};

export function useFetcherQuery<TResult = unknown, TError = unknown, TParams = unknown>(
  client: Fetcher,
  args: UseFetcherQueryArgs<TResult, TError, TParams>
) {
  const queryKey = args.params ? [...args.queryKey, args.params] : args.queryKey;
  const params = args.params ?? {};

  return useQuery<TResult, TError>(
    queryKey,
    function queryFn() {
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
    args.options,
  );
}

export type UseFetcherMutationArgs<TResult, TError, TVariables> = {
  endpoint: Endpoint<TVariables>;
  options?: UseMutationOptions<TResult, TError, TVariables>;
};

export function useFetcherMutation<TResult = unknown, TError = unknown, TVariables = unknown>(
  client: Fetcher,
  args: UseFetcherMutationArgs<TResult, TError, TVariables>
) {
  return useMutation<TResult, TError, TVariables>((params: TVariables) => {
    return args.endpoint(client, params);
  }, args.options);
}
