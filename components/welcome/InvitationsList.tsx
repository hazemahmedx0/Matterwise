import { useInvitesListQuery } from '@/lib/queries/invitation-qureies';
import { useInviteAcceptService } from '@/services/api/services/invites';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import useAuth from '@/services/auth/use-auth';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Invitation } from '@/types/invites-types';
import { Avatar, Button, Text } from '@medusajs/ui';
import React, { useMemo, useState } from 'react';

const InvitationsList = () => {
  const { user } = useAuth();
  const fetchAcceptInvite = useInviteAcceptService();

  const {
    data: InvitesListData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInvitesListQuery();

  const InvitesList = useMemo(() => {
    const result =
      (InvitesListData?.pages.flatMap(
        (page) => page?.data,
      ) as unknown as Invitation[]) ?? ([] as Invitation[]);

    if (result) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [InvitesListData]);

  const [isAccepting, setIsAccepting] = useState(false);

  const acceptInvite = (workspaceId: number, inviteId: number) => async () => {
    setIsAccepting(true);
    const { status } = await fetchAcceptInvite({
      id: workspaceId,
      inviteId: inviteId,
    });

    if (status === HTTP_CODES_ENUM.NO_CONTENT) {
      setIsAccepting(false);
      window.location.replace(`/workspaces/${workspaceId}`);
    }
  };
  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <div className=" h-0.5 w-full grow-0  bg-ui-bg-base-hover " />
        <p className=" w-full min-w-fit grow text-center text-ui-fg-muted">
          Or accept an invitation
        </p>
        <div className=" h-0.5 w-full  grow-0  bg-ui-bg-base-hover" />
      </div>
      {InvitesList?.map((invite) => (
        <div
          key={invite.id}
          className="overflow-hidden rounded-lg border border-ui-border-base"
        >
          <div className=" flex items-center px-4  py-3">
            <Avatar
              variant="squared"
              fallback="O"
              src={invite?.workspace?.photo?.path || ''}
              className="mr-3"
              size="xlarge"
            />
            <div>
              <Text as="p" size="large" leading="compact">
                {invite?.workspace?.title}
              </Text>
            </div>
            <Button
              className="ml-auto h-fit"
              variant="secondary"
              isLoading={isAccepting}
              onClick={acceptInvite(invite.workspace.id, invite.id)}
            >
              Join
            </Button>
          </div>
          <div className=" border-t border-ui-border-base bg-ui-bg-subtle-hover px-3 py-1.5 text-ui-fg-disabled">
            Invitation for{' '}
            <span className="text-ui-fg-muted">{invite.invitee_email}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationsList;
