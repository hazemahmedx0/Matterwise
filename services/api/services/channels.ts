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
      const requestUrl = new URL(
        `${API_URL}/v1/workspaces/${data.workspaceId}/channels`,
      );
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

export type ChannelRequest = {
  id: Channel['id'];
};

export type ChannelResponse = Channel;

export function useGetChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels/${data.id}`, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelResponse>);
    },
    [fetch],
  );
}

export type ChannelsPostRequest = Pick<Channel, 'title' | 'description'> & {
  type: {
    id: number;
  };
  workspace: {
    id: number;
  };
  members: Array<{
    id: number;
  }>;
};

export type UserPostResponse = Channel;

export function usePostChannelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelsPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels`, {
        method: 'POST',
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UserPostResponse>);
    },
    [fetch],
  );
}
