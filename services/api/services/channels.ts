import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { InfinityPaginationType } from '../types/infinity-pagination';
import { RequestConfigType } from './types/request-config';
import { Channel } from '@/types/channels-types';
import { Role } from '../types/role';
import { Message } from '@/types/message-types';

export type ChannelGetRequest = {
  workspaceId: string;
  page: number;
  limit: number;
};

export type ChannelGetsResponse = InfinityPaginationType<Channel>;

export function useGetChannelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelGetRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(
        `${API_URL}/v1/workspaces/${data.workspaceId}/channels`,
      );
      requestUrl.searchParams.append('page', data.page.toString());
      requestUrl.searchParams.append('limit', data.limit.toString());
      return fetch(requestUrl, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelGetsResponse>);
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

export type ChannelPatchRequest = {
  id: Channel['id'];
  data: Partial<Pick<Channel, 'title' | 'description'> & {}>;
};

export type ChannelPatchResponse = Channel;

export function usePatchChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelPatchResponse>);
    },
    [fetch],
  );
}

export type ChannelDeleteRequest = {
  id: Channel['id'];
};

export type ChannelDeleteResponse = undefined;

export function useDeleteChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/Channels/${data.id}`, {
        method: 'DELETE',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelDeleteResponse>);
    },
    [fetch],
  );
}

// MESSAGEs

export type ChannelMessagesRequest = {
  channelId: string;
  cursor: number | null | undefined | string;
  limit: number;
  filters?: {
    draft?: boolean;
    parentMessageId?: number | null;
  };
  sort?: Array<{
    orderBy: keyof Message;
    // order: SortEn;
  }>;
};

export type ChannelMessagesResponse = InfinityPaginationType<Message>;

export function useGetChannelMessagesService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelMessagesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(
        `${API_URL}/v1/channels/${data.channelId}/messages`,
      );
      if (data.cursor) {
        requestUrl.searchParams.append('cursor', data.cursor?.toString() ?? '');
      }
      requestUrl.searchParams.append('limit', data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append('filters', JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append('sort', JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelMessagesResponse>);
    },
    [fetch],
  );
}
