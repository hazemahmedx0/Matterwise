import { useChannelMessagesListQuery } from '@/lib/queries/channels-queries';
import { Message } from '@/types/message-types';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

const useIncreaseReply = ({ channelId }: { channelId: number }) => {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelMessagesListQuery({
      channelId: channelId?.toString(),
    });
  const queryClient = useQueryClient();

  const incrementChildCountOfMessage = (messageIdToUpdate: number) => {
    // Find the message with the specified ID and increment its childsCount by 1
    if (data && data.pages) {
      const updatedPages = data?.pages.map((page) => {
        if (
          page?.data.some(
            (message: Message) => message.id === messageIdToUpdate,
          )
        ) {
          return {
            ...page,
            data: page.data.map((message: Message) => {
              if (message.id === messageIdToUpdate) {
                return {
                  ...message,
                  childsCount: message.childsCount + 1,
                };
              }
              return message;
            }),
          };
        }
        return page;
      });

      // Update the specific message with the incremented childsCount
      queryClient.setQueryData(
        [
          'channelMessages',
          'list',
          'channels',
          channelId?.toString(),
          'published',
          'parentMessageId:',
        ],
        (data: any) => {
          return { ...data, pages: updatedPages };
        },
      );
    }
  };

  return { incrementChildCountOfMessage };
};

export default useIncreaseReply;
