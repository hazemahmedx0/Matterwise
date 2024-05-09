import { ElementRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

// Hooks
import { useChannelMessagesListQuery } from '@/lib/queries/channels-queries';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useIntersectionObserver } from '@uidotdev/usehooks';

// Helpers
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';

// Components
import MessageItem from './MessageItem';

// Types
import { Message } from '@/types/message-types';

const ChatMessages = ({
  messageSocketList,
}: {
  messageSocketList: Message[];
}) => {
  const { channelId } = useParams();
  // Refs
  const bottomRef = useRef<ElementRef<'div'>>(null);
  const chatRef = useRef<ElementRef<'div'>>(null);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelMessagesListQuery({
      channelId: channelId?.toString(),
    });

  const Channelsresult = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Message[]) ??
      ([] as Message[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [data]);

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [loadMoreRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '30px',
  });

  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (
      Channelsresult &&
      Channelsresult?.length > 0 &&
      entry?.isIntersecting &&
      hasNextPage
    ) {
      console.log('fetching next page', hasNextPage);
      handleScroll();
    }
  }, [Channelsresult, entry?.isIntersecting, hasNextPage]);

  useChatScroll({
    chatRef,
    bottomRef,
    count: data?.pages?.[0]?.data?.length + messageSocketList.length ?? 0,
  });
  return (
    <div
      ref={chatRef}
      // className="mt-32 flex grow flex-col-reverse content-end items-end  overflow-x-hidden "
      className="mt-32 flex max-h-full w-full grow flex-col-reverse items-end  justify-end"
    >
      {/* To snap to the end bottom of the chat list */}

      <div ref={bottomRef}></div>

      {/* Messages list */}
      {messageSocketList?.map((message: any) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {Channelsresult?.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Load more div */}
      <div
        ref={loadMoreRef}
        className={`h-12 w-4  ${!hasNextPage ? 'hidden' : null} translate-y-80`}
      ></div>
    </div>
  );
};

export default ChatMessages;
