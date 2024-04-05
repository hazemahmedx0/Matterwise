import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { InfinityPaginationType } from '../types/infinity-pagination';
import { RequestConfigType } from './types/request-config';
import { Channels, Channel } from '@/types/channels-types';
import { Workspace } from '@/types/workspace-types';

export type UsersRequest = {
  workspaceId: string;
  page: number;
  limit: number;
};

export type UsersResponse = InfinityPaginationType<Channel>;

export function useGetChannelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: UsersRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/channels/${data.workspaceId}`);
      requestUrl.searchParams.append('page', data.page.toString());
      requestUrl.searchParams.append('limit', data.limit.toString());
      console.log('requestUrl', requestUrl);
      return fetch(requestUrl, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UsersResponse>);
    },
    [fetch],
  );
}
