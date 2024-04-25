import { Channel } from '@/types/channels-types';

import SectionHeader from '@/components/settings/SectionHeader';
import { Button, Input, Text, Avatar, Badge } from '@medusajs/ui';
import React, { useCallback, useMemo } from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';

import { z } from 'zod';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import { RiLoader2Line, RiUserAddLine } from '@remixicon/react';
import {
  useChannelUsersListQuery,
  useUsersListQuery,
} from '@/lib/queries/users-queries';
import { User } from '@/services/api/types/user';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { useChannelListQuery } from '@/lib/queries/channels-queries';

const ChannelMembersTab = ({
  channelData,
}: {
  channelData: Channel | undefined;
}) => {
  const {
    data: usersdata,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChannelUsersListQuery({
    channelId: channelData?.id.toString() ?? '',
  });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const usersresult = useMemo(() => {
    const result =
      (usersdata?.pages.flatMap((page) => page?.data) as unknown as User[]) ??
      ([] as User[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [usersdata]);

  const [loadMoreRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  if (entry?.isIntersecting && hasNextPage) {
    console.log('entry', entry);
    handleScroll();
  }

  return (
    <div className=" flex w-full flex-col gap-2">
      <div className="px-3">
        <div className="mb-2 flex w-full justify-between gap-4">
          <div className="w-full">
            <Input placeholder="Search" id="search-input" type="search" />
          </div>
          <Button className=" min-w-max">
            <RiUserAddLine size={16} className=" !h-4 !w-4" />
            Add
          </Button>
        </div>
      </div>

      <div id="style-1" className="flex  flex-col overflow-auto">
        {usersresult?.map((user) => {
          return (
            <div
              key={user.id}
              className="flex  justify-between rounded-md px-3 py-3 hover:bg-ui-bg-subtle-pressed"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  src={user?.photo?.path ?? ''}
                  fallback={user.firstName?.charAt(0) ?? ''}
                />
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
                <Text>
                  {user?.role?.name === 'Admin' ? (
                    <Badge color="blue">Channel Manager</Badge>
                  ) : (
                    ''
                  )}
                </Text>
              </div>
              <Button className="text-ui-fg-muted">Remove</Button>
            </div>
          );
        })}
      </div>

      <div
        ref={loadMoreRef}
        className={`h-4 ${!hasNextPage ? 'hidden' : null}`}
      />
    </div>
  );
};

export default ChannelMembersTab;
