import useAuth from '@/services/auth/use-auth';
import { Avatar, Button, Text } from '@medusajs/ui';
import React from 'react';

const InvitationsList = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <div className=" h-0.5 w-full grow-0  bg-ui-bg-base-hover " />
        <p className=" w-full min-w-fit grow text-center text-ui-fg-muted">
          Or accept an invitation
        </p>
        <div className=" h-0.5 w-full  grow-0  bg-ui-bg-base-hover" />
      </div>

      <div className="overflow-hidden rounded-lg border border-ui-border-base">
        <div className=" flex items-center px-4  py-3">
          <Avatar
            variant="squared"
            fallback="O"
            src="https://avatars.githubusercontent.com/u/10656202?v=4"
            className="mr-3"
            size="xlarge"
          />
          <div>
            <Text as="p" size="large" leading="compact">
              Wavely
            </Text>
          </div>
          <Button className="ml-auto h-fit" variant="secondary">
            Join
          </Button>
        </div>
        <div className=" border-t border-ui-border-base bg-ui-bg-subtle-hover px-3 py-1.5 text-ui-fg-disabled">
          Invitation for{' '}
          <span className="text-ui-fg-muted">testinivte@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default InvitationsList;
