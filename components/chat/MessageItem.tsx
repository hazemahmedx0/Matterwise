import { Message } from '@/types/message-types';
import { Avatar, Text } from '@medusajs/ui';
import React from 'react';
import TiptapReadOnly from '../tiptap/TiptapReadOnly';

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div className="flex w-full max-w-full gap-4 overflow-hidden px-5 py-2 hover:bg-ui-bg-base-hover">
      <Avatar
        src={message?.sender?.photo?.path ?? undefined}
        fallback={message?.sender?.firstName?.charAt(0) ?? 'U'}
        variant="squared"
        size="large"
      />
      <div className="max-w-full overflow-hidden">
        <div>
          <Text as="span" size="large" weight="plus" className="mr-2">
            {message?.sender?.firstName ?? 'Unknown'}
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
        <div className="max-w-full overflow-hidden">
          <TiptapReadOnly content={message?.content} />
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
