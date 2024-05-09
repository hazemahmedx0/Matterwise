import { Avatar } from '@medusajs/ui';
import React from 'react';
import WorkspacesList from '../sideNav/Workspaces-List';
import UserSideNav from './UserSideNav';

const MainSideBar = () => {
  return (
    <div className=" flex h-screen max-h-screen w-16 flex-col items-center justify-between border-r border-ui-border-strong bg-ui-bg-field py-3">
      <WorkspacesList />
      <UserSideNav />
    </div>
  );
};

export default MainSideBar;
