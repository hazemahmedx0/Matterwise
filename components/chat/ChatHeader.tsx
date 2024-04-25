import { User } from '@/services/api/types/user';
import { Workspace } from '@/types/workspace-types';
import { Avatar } from '@medusajs/ui';
import { RiHashtag } from '@remixicon/react';
import React, { Children, ReactNode } from 'react';

const ChatHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex h-12 items-center justify-between border-b border-ui-border-base px-5 ">
      {children}
    </div>
  );
};

export default ChatHeader;

ChatHeader.Icon = ({ children }: { children?: ReactNode }) => {
  return <RiHashtag size={20} />;
};

ChatHeader.Title = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="-ml-2 flex  items-center gap-1 rounded-md px-2 py-1 text-ui-fg-base hover:bg-ui-bg-switch-off">
      {children}
    </div>
  );
};

ChatHeader.Actions = ({
  workspaceMembers,
}: {
  workspaceMembers?: User[] | undefined;
}) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-row ">
        {workspaceMembers?.map((member) => {
          return (
            <Avatar
              className="-ml-2"
              src={member?.avatarUrl}
              fallback={member?.firstName?.charAt(0) || 'O'}
              key={member.id}
              size="xsmall"
              variant="squared"
            />
          );
        })}
      </div>
    </div>
  );
};
