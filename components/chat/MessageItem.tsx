import { Message } from '@/types/message-types';
import { Avatar, Text } from '@medusajs/ui';
import React from 'react';
import TiptapReadOnly from '../tiptap/TiptapReadOnly';
import {
  RiArrowDropRightLine,
  RiReplyAllFill,
  RiReplyFill,
} from '@remixicon/react';
import ThreadBar from './ThreadBar';

type MessageItemProps = {
  message: Message | null | undefined;
  isThread?: boolean;
};

const MessageItem = ({ message, isThread }: MessageItemProps) => {
  if (!message) return null;
  return (
    <div className="flex w-full max-w-full gap-4  px-5 py-2 hover:bg-ui-bg-base-hover">
      <Avatar
        src={message?.sender?.photo?.path ?? undefined}
        fallback={message?.sender?.firstName?.charAt(0) ?? 'U'}
        variant="squared"
        size="large"
      />
      <div className="max-w-full overflow-hidden">
        <div>
          <Text as="span" size="large" weight="plus" className="mr-2">
            {message?.sender?.firstName ?? 'Unknown'}{' '}
            {message?.sender?.lastName}
          </Text>
          <Text as="span" size="small" className="text-ui-fg-muted">
            {new Date(message?.createdAt)
              .toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
              .replace(',', '')}{' '}
          </Text>
        </div>
        <div className="w-full overflow-hidden ">
          <TiptapReadOnly content={message?.content} />

          {message.childsCount > 0 && !isThread && (
            <ThreadBar message={message} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
