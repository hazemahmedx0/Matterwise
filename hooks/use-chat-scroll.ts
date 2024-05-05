import { useEffect, useState } from 'react';

export const useChatScroll = ({ chatRef, bottomRef, count }) => {
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
        bottomRef?.current.scrollIntoView({
          behaviour: 'smooth',
        });
      }, 100);
    }
  }, [bottomRef, chatRef, hasInitialised, count]);
};
