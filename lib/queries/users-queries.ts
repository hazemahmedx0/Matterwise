import { useGetChannelsService } from '@/services/api/services/channels';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { createQueryKeys } from '@/services/react-query/query-key-factory';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Workspace } from '@/types/workspace-types';
import {
  useGetChannelUsersService,
  useGetWorksapceUsersService,
} from '@/services/api/services/users';

export const workspaceUsersQueryKeys = createQueryKeys(['workspaces'], {
  list: () => ({
    key: ['users'],
  }),
});

export const useUsersListQuery = ({ workspaceId }: { workspaceId: string }) => {
  const fetch = useGetWorksapceUsersService();

  const query = useInfiniteQuery({
    queryKey: workspaceUsersQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch({
        workspaceId,
        page: pageParam,
        limit: 10,
      });
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};

export const channelUsersQueryKeys = createQueryKeys(['channel'], {
  list: () => ({
    key: ['channelUsers'],
  }),
});

export const useChannelUsersListQuery = ({
  channelId,
}: {
  channelId: string;
}) => {
  const fetch = useGetChannelUsersService();

  const query = useInfiniteQuery({
    queryKey: channelUsersQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch({
        channelId,
        page: pageParam,
        limit: 10,
      });
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};
