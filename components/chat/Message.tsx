import { useChannelMessagesListQuery } from '@/lib/queries/channels-queries';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Message as MessageType } from '@/types/message-types';
import { Avatar, Text } from '@medusajs/ui';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import MessageItem from './MessageItem';
import { useSocket } from '@/providers/socket-provider';
import { set } from 'react-hook-form';
import useAuth from '@/services/auth/use-auth';
import { useChatScroll } from '@/hooks/use-chat-scroll';

const Message = ({ socketMsg }: { socketMsg: any }) => {
  const params = useParams();
  const { socket } = useSocket();
  // const [socketMsg, setSocketMsg] = React.useState<MessageType[]>([]);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelMessagesListQuery({
      channelId: params.channelId.toString(),
    });

  const Channelsresult = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as MessageType[]) ??
      ([] as MessageType[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [data]);

  console.log('socketMsg', socketMsg);

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    // console.log('fetching next page');
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  console.log('Channelsresult', Channelsresult);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);

  useChatScroll({
    chatRef,
    bottomRef,
    count: data?.pages?.[0]?.data?.length + socketMsg.length ?? 0,
  });

  console.log('data', socketMsg.length);
  return (
    <div ref={chatRef} className="flex flex-col-reverse">
      <div ref={bottomRef}></div>

      {socketMsg?.map((message: any) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {Channelsresult?.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Message;
