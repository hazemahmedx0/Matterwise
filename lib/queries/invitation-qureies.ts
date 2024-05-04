import { useGetInvitesService } from '@/services/api/services/invites';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { createQueryKeys } from '@/services/react-query/query-key-factory';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const InvitesQueryKeys = createQueryKeys(['Invites'], {
  list: () => ({
    key: ['Invites'],
  }),
});

export const useInvitesListQuery = () => {
  const fetch = useGetInvitesService();

  const query = useInfiniteQuery({
    queryKey: InvitesQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch({
        page: pageParam,
        limit: 6,
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
