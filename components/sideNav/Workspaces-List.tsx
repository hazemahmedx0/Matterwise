'use client';
import {
  useWorkspaceQuery,
  useWorkspacesListQuery,
} from '@/lib/queries/workspaces-queries';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Workspace } from '@/types/workspace-types';
import { Avatar, Text } from '@medusajs/ui';
import React, { useCallback, useMemo } from 'react';

import { DropdownMenu } from '@medusajs/ui';

import { useParams } from 'next/navigation';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiSettings2Line,
} from '@remixicon/react';
import Link from 'next/link';
import useAuthActions from '@/services/auth/use-auth-actions';
import { useIntersectionObserver } from '@uidotdev/usehooks';

const WorkspacesList = () => {
  const { logOut } = useAuthActions();

  const {
    data: workspacesListData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useWorkspacesListQuery();
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = parseInt(params.workspaceId);

  const {
    data: currentWorkspaceData,
    isLoading: currentWorkspaceLoading,
    isFetching,
  } = useWorkspaceQuery({
    id: Number(workspaceId),
  });

  const workspacesList = useMemo(() => {
    const result =
      (workspacesListData?.pages.flatMap(
        (page) => page?.data,
      ) as unknown as Workspace[]) ?? ([] as Workspace[]);

    if (result && currentWorkspaceData) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [workspacesListData]);

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [loadMoreRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  if (entry?.isIntersecting && hasNextPage) {
    handleScroll();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <Avatar
            variant="squared"
            fallback={currentWorkspaceData?.title[0] || 'o'}
            src={currentWorkspaceData?.photo?.path || ''}
            size="large"
            className="cursor-pointer"
          />
          {/* <Text as="p" size="large" leading="compact" className="truncate">
              {isFetching && !currentWorkspaceData ? (
                <span className=" h-3 w-11 animate-pulse truncate rounded-md bg-ui-bg-switch-off" />
              ) : (
                ''
              )}
              {currentWorkspaceData?.title}
            </Text> */}
          {/* <RiArrowDownSLine className=" ml-auto" size={16} /> */}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          side="right"
          className=" flex max-h-72 flex-col"
        >
          {/* <Link href={`/workspaces/${workspaceId}/settings`}>
            <DropdownMenu.Item className=" gap-x-2">
              <RiSettings2Line className="text-ui-fg-subtle" size={20} />
              Settings
            </DropdownMenu.Item>
          </Link> */}
          {/* <DropdownMenu.Separator /> */}
          <div id="style-1" className="h-full  overflow-auto">
            {workspacesList?.map((workspace) => (
              <a href={`/workspaces/${workspace.id}`} key={workspace.id}>
                <DropdownMenu.Item key={workspace.id}>
                  <Avatar
                    variant="squared"
                    fallback={workspace.title[0] || 'o'}
                    src={workspace.photo?.path || ''}
                    className="mr-2"
                    size="xsmall"
                  />
                  {workspace.title}
                </DropdownMenu.Item>
              </a>
            ))}
            <div
              ref={loadMoreRef}
              className={`h-4 ${!hasNextPage ? 'hidden' : null}`}
            />
          </div>
          <DropdownMenu.Separator />
          <Link href="/welcome/new-workspace">
            <DropdownMenu.Item className=" gap-x-2">
              <RiAddLine className="text-ui-fg-subtle" size={20} />
              Add a Workspace
            </DropdownMenu.Item>
          </Link>
          {/* <DropdownMenu.Item
            className=" gap-x-2 text-ui-fg-error"
            onClick={() => {
              logOut();
            }}
          >
            <RiLogoutBoxRLine size={20} />
            Log out
          </DropdownMenu.Item> */}
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default WorkspacesList;
