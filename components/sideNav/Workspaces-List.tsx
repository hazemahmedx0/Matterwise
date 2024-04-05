'use client';
import { useWorkspacesListQuery } from '@/lib/queries/workspaces-queries';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Workspace } from '@/types/workspace-types';
import { Avatar, Text } from '@medusajs/ui';
import React, { useMemo } from 'react';

import { PencilSquare, Plus, Trash } from '@medusajs/icons';
import { DropdownMenu } from '@medusajs/ui';
import { useCurrentWorkspace } from '@/store/currentworkspaceStore';

import { useParams } from 'next/navigation';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiLogoutBoxLine,
  RiLogoutBoxRLine,
} from '@remixicon/react';
import Link from 'next/link';

const WorkspacesList = () => {
  const { data, isLoading } = useWorkspacesListQuery();
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = parseInt(params.workspaceId);

  const workspace = useCurrentWorkspace((state) => state.workspace);
  const setCurrentWorkspace = useCurrentWorkspace(
    (state) => state.setWorkspace,
  );

  const workspacesList = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Workspace[]) ??
      ([] as Workspace[]);

    return removeDuplicatesFromArrayObjects(result, 'id');
  }, [data]);

  const currentWorkspace: Workspace | undefined = workspacesList.find(
    (workspace) => workspace.id === workspaceId,
  );

  // setCurrentWorkspace(currentWorkspace!);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <div
            aria-label={currentWorkspace?.title}
            tabIndex={0}
            className="border-border-ui-border-base flex h-12 cursor-pointer  flex-row items-center  border-b px-3 align-middle"
          >
            <Avatar
              variant="squared"
              fallback="o"
              src="https://avatars.githubusercontent.com/u/10656202?v=4"
              className="mr-3"
              size="small"
            />
            <Text as="p" size="large" leading="compact">
              {currentWorkspace?.title}
            </Text>
            <RiArrowDownSLine className=" ml-auto" size={16} />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {workspacesList.map((workspace) => (
            <Link href={`/workspaces/${workspace.id}`}>
              <DropdownMenu.Item
                key={workspace.id}
                onClick={() => setCurrentWorkspace(workspace)}
              >
                <Avatar
                  variant="squared"
                  fallback="o"
                  src="https://avatars.githubusercontent.com/u/10656202?v=4"
                  className="mr-2"
                  size="xsmall"
                />
                {workspace.title}
              </DropdownMenu.Item>
            </Link>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Item className=" gap-x-2">
            <RiAddLine className="text-ui-fg-subtle" size={20} />
            Add a Workspace
          </DropdownMenu.Item>
          <DropdownMenu.Item className=" gap-x-2 text-ui-fg-error">
            <RiLogoutBoxRLine size={20} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};

export default WorkspacesList;

// {result.map((workspace) => (
//     <div
//       key={workspace.id}
//       className="flex h-12 flex-row  items-center border-b  px-3 align-middle"
//     >
//       <Avatar
//         variant="squared"
//         fallback="o"
//         src="https://avatars.githubusercontent.com/u/10656202?v=4"
//         className="mr-3"
//         size="small"
//       />
//       <p>{workspace.title}</p>
//     </div>
//   ))}
