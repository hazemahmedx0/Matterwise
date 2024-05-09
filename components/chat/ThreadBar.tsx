import { useThreadStore } from '@/store/threadStore';
import { Message } from '@/types/message-types';
import { Text } from '@medusajs/ui';
import {
  RiArrowDropRightLine,
  RiReplyAllFill,
  RiReplyFill,
} from '@remixicon/react';
import React from 'react';

const ThreadBar = ({ message }: { message: Message }) => {
  const {
    message: ThreadMsg,
    setMessage,
    setIsVisible,
    isVisible,
  } = useThreadStore();

  const setThread = () => {
    setMessage(message);
    setIsVisible(true);
  };
  return (
    <Text
      onClick={setThread}
      as="div"
      size="small"
      className=" group flex max-w-72 cursor-pointer items-center gap-2 rounded-lg border border-transparent px-3 py-1 text-ui-fg-interactive hover:border hover:border-ui-border-base hover:bg-ui-bg-base hover:text-ui-fg-interactive-hover"
    >
      {message.childsCount > 1 ? (
        <RiReplyAllFill size={16} className="my-auto inline" />
      ) : (
        <RiReplyFill size={16} className="my-auto inline" />
      )}
      {message.childsCount} {message.childsCount > 1 ? 'replies' : 'reply'}
      <RiArrowDropRightLine
        size={18}
        className=" ml-auto  text-ui-fg-disabled opacity-0  group-hover:opacity-100"
      />
    </Text>
  );
};

export default ThreadBar;
