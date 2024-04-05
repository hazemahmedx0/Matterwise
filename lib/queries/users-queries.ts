import { useGetChannelsService } from '@/services/api/services/channels';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { createQueryKeys } from '@/services/react-query/query-key-factory';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Workspace } from '@/types/workspace-types';
import { useGetWorksapceUsersService } from '@/services/api/services/users';

export const channelsQueryKeys = createQueryKeys(['workspaces'], {
  list: () => ({
    key: ['users'],
  }),
});

export const useUsersListQuery = ({ workspaceId }: { workspaceId: string }) => {
  const fetch = useGetWorksapceUsersService();

  const query = useInfiniteQuery({
    queryKey: channelsQueryKeys.list().key,
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
