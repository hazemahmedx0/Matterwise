import { useEffect, useState } from 'react';
type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  count: number;
};
export const useChatScroll = ({
  chatRef,
  bottomRef,
  count,
}: ChatScrollProps) => {
  const [hasInitialised, setHasInitialised] = useState(false);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasInitialised && bottomDiv) {
        setHasInitialised(true);
        return true;
      }
      if (!topDiv) {
        return false;
      }
      const distanceFromButtom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromButtom <= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({
          behavior: hasInitialised ? 'smooth' : 'auto',
        });
      }, 100);
    }
  }, [bottomRef, chatRef, hasInitialised, count]);
};
