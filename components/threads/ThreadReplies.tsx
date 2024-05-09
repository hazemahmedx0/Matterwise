import { ElementRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

// Hooks
import { useChannelMessagesListQuery } from '@/lib/queries/channels-queries';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useIntersectionObserver } from '@uidotdev/usehooks';

// Helpers
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';

// Components

// Types
import { Message } from '@/types/message-types';
import MessageItem from '../chat/MessageItem';

const ThreadReplies = ({
  messageSocketList,
  threadMsgs,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  messageSocketList: Message[];
  threadMsgs: Message[] | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) => {
  const { channelId } = useParams();
  // Refs
  const bottomRef = useRef<ElementRef<'div'>>(null);
  const chatRef = useRef<ElementRef<'div'>>(null);

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

  if (threadMsgs?.length === 0 && isLoading) {
    return <div>Loading...</div>;
  }
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (
      threadMsgs &&
      threadMsgs?.length > 0 &&
      entry?.isIntersecting &&
      hasNextPage
    ) {
      console.log('fetching next page', hasNextPage);
      handleScroll();
    }
  }, [threadMsgs, entry?.isIntersecting, hasNextPage]);

  useChatScroll({
    chatRef,
    bottomRef,
    count: threadMsgs?.length + messageSocketList.length ?? 0,
  });
  return (
    <div
      ref={chatRef}
      // className="mt-32 flex grow flex-col-reverse content-end items-end  overflow-x-hidden "
      className=" mt-2 flex max-h-full w-full grow flex-col-reverse items-end  justify-end"
    >
      {/* To snap to the end bottom of the chat list */}

      <div ref={bottomRef}></div>

      {/* Messages list */}
      {messageSocketList?.map((message: any) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {threadMsgs?.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Load more div */}
      <div
        ref={loadMoreRef}
        onClick={handleScroll}
        className={`h-12 w-4  ${!hasNextPage ? 'hidden' : null} translate-y-80`}
      >
        dsds
      </div>
    </div>
  );
};

export default ThreadReplies;
