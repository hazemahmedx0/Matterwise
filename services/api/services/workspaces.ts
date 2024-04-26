import { useCallback } from 'react';
import useFetch from '../use-fetch';
import { API_URL } from '../config';
import wrapperFetchJsonResponse from '../wrapper-fetch-json-response';
import { InfinityPaginationType } from '../types/infinity-pagination';
import { RequestConfigType } from './types/request-config';
import { Workspace } from '@/types/workspace-types';

export type UsersRequest = {
  page: number;
  limit: number;
};

export type WorkspacesResponse = InfinityPaginationType<Workspace>;

export function useGetWorkspacesService() {
  const fetch = useFetch();

  return useCallback(
    (data: UsersRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/workspaces`);
      requestUrl.searchParams.append('page', data.page.toString());
      requestUrl.searchParams.append('limit', data.limit.toString());

      return fetch(requestUrl, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<WorkspacesResponse>);
    },
    [fetch],
  );
}

export type WorksapceRequest = {
  id: Workspace['id'];
};

export type WorksapceResponse = Workspace;

export function useGetWorkspaceService() {
  const fetch = useFetch();

  return useCallback(
    (data: WorksapceRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/workspaces/${data.id}`, {
        method: 'GET',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<WorksapceResponse>);
    },
    [fetch],
  );
}

export type WorkspacesPostRequest = Pick<
  Workspace,
  'title' | 'description'
> & {};

export type UserPostResponse = Workspace;

export function usePostWorkspacesService() {
  const fetch = useFetch();

  return useCallback(
    (data: WorkspacesPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/workspaces`, {
        method: 'POST',
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UserPostResponse>);
    },
    [fetch],
  );
}

export type WorkspacePatchRequest = {
  id: Workspace['id'];
  data: Partial<Pick<Workspace, 'title' | 'description' | 'photo'> & {}>;
};

export type WorkspacePatchResponse = Workspace;

export function usePatchWorkspaceService() {
  const fetch = useFetch();

  return useCallback(
    (data: WorkspacePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/workspaces/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<WorkspacePatchResponse>);
    },
    [fetch],
  );
}

export type WorkspaceDeleteRequest = {
  id: Workspace['id'];
};

export type WorkspaceDeleteResponse = undefined;

export function useDeleteWorkspaceService() {
  const fetch = useFetch();

  return useCallback(
    (data: WorkspaceDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/workspaces/${data.id}`, {
        method: 'DELETE',
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<WorkspaceDeleteResponse>);
    },
    [fetch],
  );
}

// invites users to workspace

type Emails = {
  emails: string[];
};

type Invitation = {
  invites: Invite[];
  invitedEmails: string[];
  duplicateEmails: string[];
};

type Invite = {
  id: number;
  sender: {
    id: number;
  };
  invitee_email: string;
  workspace: {
    id: number;
  };
  status: {
    id: number;
  };
  createdAt: string; // assuming this is an ISO string date
  updatedAt: string; // assuming this is an ISO string date
};

export type UserInvitePostRequest = {
  id: number;
  data: Emails;
};

export type UserInvitePostResponse = Invitation;

export function usePostInviteUserService() {
  const fetch = useFetch();

  return useCallback(
    (data: UserInvitePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/workspaces/${data.id}/invite`, {
        method: 'POST',
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<UserInvitePostResponse>);
    },
    [fetch],
  );
}
