import { Avatar, Text } from '@medusajs/ui';
import React from 'react';

const Message = () => {
  return (
    <div className="flex gap-4 px-5 py-2 hover:bg-ui-bg-base-hover">
      <Avatar
        src="https://avatars.githubusercontent.com/u/47269261?s=400&u="
        fallback="x"
        variant="squared"
        size="large"
      />
      <div>
        <div className=" ">
          <Text as="span" size="large" weight="plus" className="mr-2">
            John Doe
          </Text>
          <Text as="span" size="small" className="text-ui-fg-muted">
            12:00 PM
          </Text>
        </div>
        <div>
          <Text as="span" size="large" className="">
            Text message
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Message;
