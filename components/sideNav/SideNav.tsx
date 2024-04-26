'use client';
import { Avatar, Text } from '@medusajs/ui';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import WorkspacesList from './Workspaces-List';
import {
  RiArrowDownSFill,
  RiAtLine,
  RiChatThreadLine,
  RiFile2Line,
  RiHashtag,
  RiSendPlaneLine,
} from '@remixicon/react';
import { useChannelListQuery } from '@/lib/queries/channels-queries';
import { Channel } from '@/types/channels-types';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { useParams } from 'next/navigation';
import { useUsersListQuery } from '@/lib/queries/users-queries';
import { User } from '@/services/api/types/user';
import NewChannelModal from '../modals/NewChannelModal';
import InviteUsersModal from '../modals/InviteUsersModal';

const mainSections = [
  {
    title: 'Threads',
    href: '/',
    icon: <RiChatThreadLine size={16} />,
  },
  {
    title: 'Activity',
    href: '/',
    icon: <RiAtLine size={16} />,
  },
  {
    title: 'Drafts & sent',
    href: '/',
    icon: <RiSendPlaneLine size={16} />,
  },
  {
    title: 'Files',
    href: '/',
    icon: <RiFile2Line size={16} />,
  },
];

const SideNav = ({ workspaceId }: { workspaceId: string }) => {
  const activeStateCss = 'bg-ui-bg-switch-off text-ui-fg-base';
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const params = useParams();
  const { data, isLoading } = useChannelListQuery({
    workspaceId: params.workspaceId.toString(),
  });
  const { data: usersdata, isLoading: userLoading } = useUsersListQuery({
    workspaceId: params.workspaceId.toString(),
  });
  const Channelsresult = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Channel[]) ??
      ([] as Channel[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [data]);
  const usersresult = useMemo(() => {
    const result =
      (usersdata?.pages.flatMap((page) => page?.data) as unknown as User[]) ??
      ([] as User[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [usersdata]);
  return (
    <nav className="relative min-h-screen bg-ui-bg-subtle">
      <WorkspacesList />

      <div id="style-1" className=" h-[calc(100vh-48px)] overflow-y-auto">
        <ul className=" mt-3 text-ui-fg-subtle">
          {mainSections.map((section) => (
            <li key={section.title} className="nav-list-item">
              <Link href={section.href} className="flex h-7 items-center px-5">
                {section.icon}
                <Text
                  leading="compact"
                  size="small"
                  className="ml-1.5  truncate"
                >
                  {section.title}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
        {/* Channels */}

        <Text
          leading="compact"
          size="small"
          className=" mt-3 flex h-7 flex-row items-center truncate border-t border-ui-border-base px-5  pt-3 text-ui-fg-subtle"
        >
          <RiArrowDownSFill
            className={`mr-1.5  ${!showChannels ? '!-rotate-90' : null}`}
            size={16}
            onClick={() => setShowChannels(!showChannels)}
          />
          Channels
        </Text>

        <ul
          className={`mt-2 truncate text-ui-fg-subtle ${!showChannels ? 'hidden' : null}`}
        >
          {Channelsresult?.map((channel) => (
            <li key={channel.id} className="nav-list-item">
              <Link
                replace={true}
                prefetch={false}
                href={`/workspaces/${params.workspaceId}/channels/${channel.id.toString()}`}
                className={`nav-list-item flex h-7 items-center px-5 ${params.channelId && params.channelId === channel.id.toString() && activeStateCss} `}
              >
                <RiHashtag size={16} />
                <Text
                  leading="compact"
                  size="small"
                  className=" ml-1.5 truncate"
                >
                  {channel.title}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
        <NewChannelModal />

        {/* Users */}

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
                className={`flex h-7 items-center px-5 ${params.conversationId && params.conversationId === user.id.toString() && activeStateCss} `}
              >
                <Avatar
                  variant="squared"
                  fallback="o"
                  src="https://avatars.githubusercontent.com/u/10656202?v=4"
                  size="2xsmall"
                />
                <Text
                  leading="compact"
                  size="small"
                  className="ml-1.5 truncate"
                >
                  {user.firstName} {user.lastName}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
        <InviteUsersModal />
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
