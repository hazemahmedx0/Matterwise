'use client';
import { Avatar, Text } from '@medusajs/ui';
import {
  ArrowDown01Icon,
  BubbleChatAddIcon,
  BubbleChatIcon,
  File01Icon,
  GridIcon,
  SentIcon,
  ThreadsRectangleIcon,
} from 'hugeicons-react';
import Link from 'next/link';
import React, { useState } from 'react';

const mainSections = [
  {
    title: 'Threads',
    href: '/',
    icon: <BubbleChatIcon size={16} />,
  },
  {
    title: 'Activity',
    href: '/',
    icon: <ThreadsRectangleIcon size={16} />,
  },
  {
    title: 'Drafts & sent',
    href: '/',
    icon: <SentIcon size={16} />,
  },
  {
    title: 'Files',
    href: '/',
    icon: <File01Icon size={16} />,
  },
];

const TempUsers = [
  {
    id: '3493493',
    name: 'John Doe',
    avatar: 'https://avatars.githubusercontent.com/u/10656202?v=4',
  },
  {
    id: '3493493',
    name: 'John Doe',
    avatar: 'https://avatars.githubusercontent.com/u/10656202?v=4',
  },
  {
    id: '3493493',
    name: 'John Doe',
    avatar: 'https://avatars.githubusercontent.com/u/10656202?v=4',
  },
];

const SideNav = () => {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);

  return (
    <nav className="min-h-screen bg-ui-bg-subtle">
      <div
        aria-label="Wavely"
        tabIndex={0}
        className="border-border-ui-border-base flex h-12 flex-row  items-center border-b  px-3 align-middle"
      >
        <Avatar
          variant="squared"
          fallback="o"
          src="https://avatars.githubusercontent.com/u/10656202?v=4"
          className="mr-3"
          size="small"
        />
        <p>Wavely</p>

        <ArrowDown01Icon className=" ml-auto" size={16} />
      </div>

      <div>
        <ul className=" mt-3 text-ui-fg-subtle">
          {mainSections.map((section) => (
            <li key={section.title} className="nav-list-item">
              <Link href={section.href} className="flex h-7 items-center px-5">
                {section.icon}
                <Text leading="compact" size="small" className="  ml-1.5">
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
          className=" mt-3 flex h-7 flex-row items-center border-t border-ui-border-base px-5 pt-3  text-ui-fg-subtle"
        >
          <ArrowDown01Icon
            className={`mr-1.5  ${!showChannels ? '!-rotate-90' : null}`}
            // className="!-rotate-90"
            size={16}
            onClick={() => setShowChannels(!showChannels)}
          />
          Channels
        </Text>

        <ul
          className={`mt-2 text-ui-fg-subtle ${!showChannels ? 'hidden' : null}`}
        >
          {TempUsers.map((user) => (
            <li key={user.id} className="nav-list-item">
              <Link href={user.id} className="flex h-7 items-center px-5">
                <GridIcon size={16} />
                <Text leading="compact" size="small" className="  ml-1.5">
                  {user.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>

        {/* Users */}

        <Text
          leading="compact"
          size="small"
          className=" mt-3 flex h-7 flex-row items-center border-t border-ui-border-base px-5 pt-3  text-ui-fg-subtle"
        >
          <ArrowDown01Icon
            className={`mr-1.5  ${!showDirectMessages ? '!-rotate-90' : null}`}
            size={16}
            onClick={() => setShowDirectMessages(!showDirectMessages)}
          />
          Direct Messages
        </Text>

        <ul
          className={`mt-2 text-ui-fg-subtle ${!showDirectMessages ? 'hidden' : null}`}
        >
          {TempUsers.map((user) => (
            <li key={user.id} className="nav-list-item">
              <Link href={user.id} className="flex h-7 items-center px-5">
                <Avatar
                  variant="squared"
                  fallback="o"
                  src={user.avatar}
                  size="2xsmall"
                />
                <Text leading="compact" size="small" className=" ml-1.5">
                  {user.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;

// TODO
// Refactor redundant code
// Add hover states
// Add "ADD CHANNEL" and "ADD DIRECT MESSAGE" buttons
