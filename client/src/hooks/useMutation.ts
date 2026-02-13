import type { Key as SWRKey } from "swr";
import useSWRMutation, { MutationFetcher as SWRMutationFetcher } from "swr/mutation";

export function useMutation<Data, Arg, K extends SWRKey = string>(
  key: K,
  fetcher: (key: K, opts: { arg: Arg }) => Promise<Data>,
) {
  return useSWRMutation<Data, unknown, K, Arg>(key, fetcher as SWRMutationFetcher<Data, K, Arg>);
}
