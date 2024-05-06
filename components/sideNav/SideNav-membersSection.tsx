import { Avatar, Text } from '@medusajs/ui';
import { RiAddLine, RiArrowDownSFill } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import InviteUsersModal from '../modals/InviteUsersModal';
import Link from 'next/link';
import { useUsersListQuery } from '@/lib/queries/users-queries';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/services/api/types/user';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';

const SideNavMembersSection = () => {
  const params = useParams();

  const [showDirectMessages, setShowDirectMessages] = useState(true);

  const { data: usersdata, isLoading: userLoading } = useUsersListQuery({
    workspaceId: params.workspaceId.toString(),
  });

  const usersresult = useMemo(() => {
    const result =
      (usersdata?.pages.flatMap((page) => page?.data) as unknown as User[]) ??
      ([] as User[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [usersdata]);

  return (
    <>
      <Text
        leading="compact"
        size="small"
        className="mt-3 flex h-7 flex-row items-center truncate border-t border-ui-border-base px-5 pt-3  text-ui-fg-subtle"
      >
        <RiArrowDownSFill
          className={`mr-1.5  ${!showDirectMessages ? '!-rotate-90' : null}`}
          size={16}
          onClick={() => setShowDirectMessages(!showDirectMessages)}
        />
        Direct Messages
      </Text>

      <ul
        className={`mt-2 text-ui-fg-subtle ${!showDirectMessages ? 'hidden' : null}`}
      >
        {usersresult?.map((user) => (
          <li key={user.id} className="nav-list-item">
            <Link
              replace={true}
              prefetch={false}
              href={`/workspaces/${params.workspaceId}/conversation/${user.id.toString()}`}
              className={`flex h-7 items-center px-5 ${params.conversationId && params.conversationId === user.id.toString() && 'nav-list-item-active'} `}
            >
              <Avatar
                variant="squared"
                fallback="o"
                src="https://avatars.githubusercontent.com/u/10656202?v=4"
                size="2xsmall"
              />
              <Text leading="compact" size="small" className="ml-1.5 truncate">
                {user.firstName} {user.lastName}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
      <InviteUsersModal className="w-full">
        <div className={`nav-list-item flex h-7 w-full items-center  px-5`}>
          <RiAddLine size={16} />
          <Text leading="compact" size="small" className=" ml-1.5 truncate">
            Add People{' '}
          </Text>
        </div>
      </InviteUsersModal>
    </>
  );
};

export default SideNavMembersSection;
