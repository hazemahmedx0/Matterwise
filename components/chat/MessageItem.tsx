import { Message } from '@/types/message-types';
import { Avatar, Text } from '@medusajs/ui';
import React from 'react';
import Tiptap from '../tiptap/Tiptap';
import TiptapReadOnly from '../tiptap/TiptapReadOnly';

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div className="flex gap-4 px-5 py-2 hover:bg-ui-bg-base-hover">
      <Avatar
        src="https://avatars.githubusercontent.com/u/47269261?s=400&u="
        fallback="x"
        variant="squared"
        size="large"
        //   onClick={handleScroll}
      />
      <div>
        <div>
          <Text as="span" size="large" weight="plus" className="mr-2">
            {message?.sender?.firstName ?? 'Unknown'}
          </Text>
          <Text as="span" size="small" className="text-ui-fg-muted">
            {/* convert it to this format and hours 11/01/2024 03:18 pm */}
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
        <div>
          <TiptapReadOnly content={message?.content} />
          {/* <Text as="span" size="large" className="">
            {message?.content}
          </Text> */}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
