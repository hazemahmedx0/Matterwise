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

export type UsersResponse = InfinityPaginationType<Workspace>;

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
      }).then(wrapperFetchJsonResponse<UsersResponse>);
    },
    [fetch],
  );
}

// export type UserRequest = {
//   id: User["id"];
// };

// export type UserResponse = User;

// export function useGetUserService() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: UserRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/users/${data.id}`, {
//         method: "GET",
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<UserResponse>);
//     },
//     [fetch]
//   );
// }

// export type UserPostRequest = Pick<
//   User,
//   "email" | "firstName" | "lastName" | "photo" | "role"
// > & {
//   password: string;
// };

// export type UserPostResponse = User;

// export function usePostUserService() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: UserPostRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/users`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<UserPostResponse>);
//     },
//     [fetch]
//   );
// }

// export type UserPatchRequest = {
//   id: User["id"];
//   data: Partial<
//     Pick<User, "email" | "firstName" | "lastName" | "photo" | "role"> & {
//       password: string;
//     }
//   >;
// };

// export type UserPatchResponse = User;

// export function usePatchUserService() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: UserPatchRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/users/${data.id}`, {
//         method: "PATCH",
//         body: JSON.stringify(data.data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<UserPatchResponse>);
//     },
//     [fetch]
//   );
// }

// export type UsersDeleteRequest = {
//   id: User["id"];
// };

// export type UsersDeleteResponse = undefined;

// export function useDeleteUsersService() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: UsersDeleteRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/users/${data.id}`, {
//         method: "DELETE",
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<UsersDeleteResponse>);
//     },
//     [fetch]
//   );
// }
