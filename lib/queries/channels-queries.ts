import {
  useGetChannelMessagesService,
  useGetChannelsService,
} from '@/services/api/services/channels';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { createQueryKeys } from '@/services/react-query/query-key-factory';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Workspace } from '@/types/workspace-types';

export const channelsQueryKeys = createQueryKeys(['channels'], {
  list: () => ({
    key: ['channels'],
  }),
});

export const useChannelListQuery = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const fetch = useGetChannelsService();

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

// Channel Messages

export const channelMessagesQueryKeys = createQueryKeys(['channelMessages'], {
  list: () => ({
    key: ['channels'],
  }),
});

export const useChannelMessagesListQuery = ({
  channelId,
  sort,
  filter,
}: {
  channelId: string;
  sort?: string;
  filter?: string;
}) => {
  const fetch = useGetChannelMessagesService();

  const query = useInfiniteQuery({
    queryKey: channelMessagesQueryKeys.list().key,
    initialPageParam: { cursor: null }, // Start with a cursor set to null
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch({
        channelId,
        cursor: pageParam.cursor, // Use cursor from pageParam
        limit: 5,
      });
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.messages,
          nextPageParam: data.nextCursor ? { cursor: data.nextCursor } : null, // Prepare the next cursor
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPageParam; // Pass the next cursor for the next page fetch
    },
    gcTime: 0,
  });

  return query;
};
