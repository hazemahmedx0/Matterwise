'use client';
import Link from 'next/link';
import React,  from 'react';
import { useParams, useRouter } from 'next/navigation';

// Components
import WorkspacesList from './Workspaces-List';
import SideNavMainSections from './SideNav-mainSections';
import SideNavChannelsSection from './SideNav-channelsSection';
import SideNavMembersSection from './SideNav-membersSection';

//Modals

// Hooks

// Helpers

// Types

// Constants

const SideNav = ({ workspaceId }: { workspaceId: string }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <nav className="relative min-h-screen bg-ui-bg-subtle">
      <WorkspacesList />

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
