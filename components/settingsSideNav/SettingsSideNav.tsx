'use client';
import useAuth from '@/services/auth/use-auth';
import React, { useState } from 'react';
import { userIsAdmin } from '@/lib/actions/checkIfAdmin';
import useIsAdmin from '@/hooks/useIsAdmin';
import { Text } from '@medusajs/ui';
import {
  RemixiconComponentType,
  RiArrowLeftSLine,
  RiBuilding4Line,
  RiGroupLine,
  RiNotification3Line,
  RiUser2Line,
} from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingItem {
  title: string;
  icon: RemixiconComponentType;
  path: string;
}

const SettingsSideNav = ({ workspaceId }: { workspaceId: string }) => {
  const path = usePathname();
  console.log(path);
  const isAdmin = useIsAdmin(workspaceId);

  const basePath = `/workspaces/${workspaceId}/settings`;
  const workspaceSettingsList: SettingItem[] = [
    {
      title: 'General',
      icon: RiBuilding4Line,
      path: `${basePath}/workspace`,
    },
    {
      title: 'Members',
      icon: RiGroupLine,
      path: `${basePath}/members`,
    },
  ];

  const userSettingsList: SettingItem[] = [
    {
      title: 'Account',
      icon: RiUser2Line,
      path: `${basePath}/account`,
    },
    {
      title: 'Notifications',
      icon: RiNotification3Line,
      path: `${basePath}/notifications`,
    },
  ];

  return (
    <div className="relative min-h-screen bg-ui-bg-subtle">
      <div className=" flex  content-center items-center gap-2 border-b border-ui-border-base px-2 py-2.5">
        <RiArrowLeftSLine
          tabIndex={0}
          className=" transform cursor-pointer rounded-md text-ui-fg-muted hover:bg-ui-bg-base-pressed"
          onClick={() => window.history.back()}
        />
        <Text size="large" className="text-ui-fg-subtle">
          Settings
        </Text>
      </div>
      <SetingsListItems
        settingsList={userSettingsList}
        sectionTitle="Account"
      />

      {isAdmin && (
        <SetingsListItems
          settingsList={workspaceSettingsList}
          sectionTitle="Workspace"
        />
      )}
    </div>
  );
};

export default SettingsSideNav;

const SetingsListItems = ({
  settingsList,
  sectionTitle,
}: {
  settingsList: SettingItem[];
  sectionTitle: string;
}) => {
  const path = usePathname();
  console.log('pathh', path);
  console.log('pathh', path);
  return (
    <>
      <Text
        size="large"
        className="mb-1.5 mt-4 truncate px-4 text-ui-fg-subtle"
      >
        {sectionTitle}
      </Text>
      <ul>
        {settingsList?.map((item) => {
          return (
            <li key={item.title} className="nav-list-item">
              <Link
                href={item.path}
                className={`flex h-7 items-center px-4 ${path === item.path ? 'bg-ui-bg-switch-off text-ui-fg-base' : null} `}
              >
                <item.icon size={16} />
                <Text
                  leading="compact"
                  size="small"
                  className="ml-1.5  truncate"
                >
                  {item.title}
                </Text>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
