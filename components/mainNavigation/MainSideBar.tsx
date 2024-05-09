import React, { useEffect, useState } from 'react';
import WorkspacesList from '../sideNav/Workspaces-List';
import UserSideNav from './UserSideNav';
import { useTheme } from 'next-themes';
import ThemeSwitch from './ThemeSwitch';

const MainSideBar = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className=" flex h-screen max-h-screen w-16 flex-col items-center border-r border-ui-border-strong bg-ui-bg-field py-3">
      <WorkspacesList />
      <div className="mb-3 mt-auto">
        <ThemeSwitch />
      </div>
      <UserSideNav />
    </div>
  );
};

export default MainSideBar;
