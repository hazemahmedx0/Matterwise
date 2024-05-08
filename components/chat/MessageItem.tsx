import { Message } from '@/types/message-types';
import { Avatar, Text } from '@medusajs/ui';
import React from 'react';
import TiptapReadOnly from '../tiptap/TiptapReadOnly';
import {
  RiArrowDropRightLine,
  RiArrowLeftLine,
  RiReplyAllFill,
  RiReplyFill,
} from '@remixicon/react';

const MessageItem = ({ message }: { message: Message }) => {
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
        <div className="w-full overflow-hidden ">
          <TiptapReadOnly content={message?.content} />
          {message.childsCount > 0 && (
            <Text
              as="div"
              size="small"
              className="group flex max-w-72 items-center gap-2 rounded-lg border border-transparent px-3 py-1 text-ui-fg-interactive hover:border hover:border-ui-border-base hover:bg-ui-bg-base hover:text-ui-fg-interactive-hover"
            >
              {message.childsCount > 1 ? (
                <RiReplyAllFill size={16} className="my-auto inline" />
              ) : (
                <RiReplyFill size={16} className="my-auto inline" />
              )}
              {message.childsCount}{' '}
              {message.childsCount > 1 ? 'replies' : 'reply'}
              <RiArrowDropRightLine
                size={18}
                className=" ml-auto  text-ui-fg-disabled opacity-0  group-hover:opacity-100"
              />
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
