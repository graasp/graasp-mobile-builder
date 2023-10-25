import { configureQueryClient } from '@graasp/query-client';

import { API_HOST } from './constants/constants';

// Create a client
const {
  queryClient,
  useQueryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  mutations,
} = configureQueryClient({
  API_HOST,
  notifier: (e) => {
    console.log(e);
  },
  enableWebsocket: false,
  //   defaultQueryOptions: {
  //     keepPreviousData: true,
  //     refetchOnMount: false,
  //     // avoid refetching when same data are closely fetched
  //     staleTime: 1000, // ms
  //     cacheTime: 1000, // ms
  //   },
});

export {
  queryClient,
  useQueryClient,
  QueryClientProvider,
  hooks,
  mutations,
  ReactQueryDevtools,
};

export default queryClient;
