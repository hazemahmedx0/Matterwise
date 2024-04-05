import { useGetWorkspacesService } from '@/services/api/services/workspaces';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { createQueryKeys } from '@/services/react-query/query-key-factory';
import { useInfiniteQuery } from '@tanstack/react-query';

export const workspacesQueryKeys = createQueryKeys(['workspaces'], {
  list: () => ({
    key: ['workspaces'],
  }),
});

export const useWorkspacesListQuery = () => {
  const fetch = useGetWorkspacesService();

  const query = useInfiniteQuery({
    queryKey: workspacesQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch({
        page: pageParam,
        limit: 10,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data,
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
