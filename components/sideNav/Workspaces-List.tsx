'use client';
import {
  useWorkspaceQuery,
  useWorkspacesListQuery,
} from '@/lib/queries/workspaces-queries';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Workspace } from '@/types/workspace-types';
import { Avatar, Text } from '@medusajs/ui';
import React, { useCallback, useMemo } from 'react';

import { PencilSquare, Plus, Trash } from '@medusajs/icons';
import { DropdownMenu } from '@medusajs/ui';
import { useCurrentWorkspace } from '@/store/currentworkspaceStore';

import { useParams } from 'next/navigation';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiLogoutBoxLine,
  RiLogoutBoxRLine,
  RiSettings2Line,
} from '@remixicon/react';
import Link from 'next/link';
import useAuthActions from '@/services/auth/use-auth-actions';
import { useGetWorkspaceService } from '@/services/api/services/workspaces';
import Skeleton from 'react-loading-skeleton';
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
        <DropdownMenu.Trigger asChild>
          <div
            aria-label={currentWorkspaceData?.title}
            tabIndex={0}
            className="border-border-ui-border-base flex h-12 cursor-pointer  flex-row items-center  border-b px-3 align-middle"
          >
            <Avatar
              variant="squared"
              fallback={currentWorkspaceData?.title[0] || 'o'}
              src={currentWorkspaceData?.photo?.path || ''}
              className="mr-3"
              size="small"
            />
            <Text as="p" size="large" leading="compact">
              {isFetching && !currentWorkspaceData ? (
                <div className=" h-3 w-11 animate-pulse rounded-md bg-ui-bg-switch-off" />
              ) : (
                ''
              )}
              {currentWorkspaceData?.title}
            </Text>
            <RiArrowDownSLine className=" ml-auto" size={16} />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <Link href={`/workspaces/${workspaceId}/settings`}>
            <DropdownMenu.Item className=" gap-x-2">
              <RiSettings2Line className="text-ui-fg-subtle" size={20} />
              Settings
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <div id="style-1" className=" max-h-48 overflow-auto">
            {workspacesList?.map((workspace) => (
              <Link href={`/workspaces/${workspace.id}`} key={workspace.id}>
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
              </Link>
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
          <DropdownMenu.Item
            className=" gap-x-2 text-ui-fg-error"
            onClick={() => {
              logOut();
            }}
          >
            <RiLogoutBoxRLine size={20} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default WorkspacesList;
