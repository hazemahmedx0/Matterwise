import { useCallback } from 'react';
import { InfinityPaginationType } from '../types/infinity-pagination';
import useFetch from '../use-fetch';
import { RequestConfigType } from './types/request-config';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { Invitation } from '@/types/invites-types';
import { Workspace } from '@/types/workspace-types';

export type InvitesRequest = {
  page: number;
  limit: number;
};

export type InvitesResponse = InfinityPaginationType<Invitation>;

export function useGetInvitesService() {
  const fetch = useFetch();

  return useCallback(
    (data: InvitesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/invites`);
      requestUrl.searchParams.append('page', data.page.toString());
      requestUrl.searchParams.append('limit', data.limit.toString());

      return fetch(requestUrl, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<InvitesResponse>);
    },
    [fetch],
  );
}

export type InviteAcceptRequest = {
  id: Workspace['id'];
  inviteId: Invitation['id'];
};

export type InviteAcceptResponse = undefined;

export function useInviteAcceptService() {
  const fetch = useFetch();

  return useCallback(
    (data: InviteAcceptRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/workspaces/${data.id}/invite/${data.inviteId}`,
        {
          method: 'POST',
          ...requestConfig,
        },
      ).then(wrapperFetchJsonResponse<InviteAcceptResponse>);
    },
    [fetch],
  );
}
