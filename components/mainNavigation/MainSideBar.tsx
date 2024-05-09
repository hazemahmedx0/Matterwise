import { Avatar } from '@medusajs/ui';
import React from 'react';

const MainSideBar = () => {
  return (
    <div className=" flex h-screen max-h-screen w-16 flex-col items-center border-r border-ui-border-strong bg-ui-bg-field py-3">
      <Avatar variant="squared" fallback={'o'} src={''} size="large" />

      <Avatar
        variant="squared"
        fallback={'o'}
        src={''}
        size="xsmall"
        className=" mt-auto"
      />
    </div>
  );
};

export default MainSideBar;
