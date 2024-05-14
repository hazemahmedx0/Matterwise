'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Components
import WorkspacesList from './Workspaces-List';
import SideNavMainSections from './SideNav-mainSections';
import SideNavChannelsSection from './SideNav-channelsSection';
import SideNavMembersSection from './SideNav-membersSection';
import { Avatar, Button, DropdownMenu } from '@medusajs/ui';
import { useWorkspaceQuery } from '@/lib/queries/workspaces-queries';
import {
  RiArrowDropDownLine,
  RiGroupLine,
  RiSettings2Line,
  RiUser2Line,
} from '@remixicon/react';
import { useArrowKeyFocus } from '@/lib/actions/useOnKeyDown';

//Modals

// Hooks

// Helpers

// Types

// Constants

const SideNav = ({ workspaceId }: { workspaceId: string }) => {
  const onKeyDown = useArrowKeyFocus();
  const {
    data: currentWorkspaceData,
    isLoading: currentWorkspaceLoading,
    isFetching,
  } = useWorkspaceQuery({
    id: Number(workspaceId),
  });
  return (
    <nav className="relative min-h-screen bg-ui-bg-subtle">
      {/* <button className="x1 focus:bg-green-400">X111111</button> */}

      {/* <button onKeyDown={onKeyDown}>sdsdsds </button>
      <button onKeyDown={onKeyDown}>sdsdsds </button>
      <button onKeyDown={onKeyDown}>sdsdsds </button> */}
      <DropdownMenu>
        <DropdownMenu.Trigger asChild className=" text-left">
          <Button variant="transparent" size="base" className="mx-2 mt-3">
            {currentWorkspaceData?.title}
            <RiArrowDropDownLine />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" className="ml-2">
          <Link href={`/workspaces/${workspaceId}/settings/workspace`}>
            <DropdownMenu.Item className=" gap-x-2">
              <RiSettings2Line className="text-ui-fg-subtle" size={20} />
              Settings
            </DropdownMenu.Item>
          </Link>
          <Link href={`/workspaces/${workspaceId}/settings/members`}>
            <DropdownMenu.Item className=" gap-x-2">
              <RiGroupLine className="text-ui-fg-subtle" size={20} />
              People
            </DropdownMenu.Item>
          </Link>{' '}
        </DropdownMenu.Content>
      </DropdownMenu>
      {/* <button onKeyDown={onKeyDown}>sdss </button> */}

      <div
        id="style-1"
        className=" h-[calc(100vh-48px)] w-full overflow-y-auto"
      >
        <SideNavMainSections />

        {/* Channels */}

        <SideNavChannelsSection />

        {/* Users */}
        <SideNavMembersSection />
      </div>
    </nav>
  );
};

export default SideNav;

// TODO
// Refactor redundant code
// Add hover states
// Add "ADD CHANNEL" and "ADD DIRECT MESSAGE" buttons
// Update img src
