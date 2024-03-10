'use client';

import WorkspacesNav from '@/components/workspaces/WorkspacesNav';
import { useGetWorkspacesService } from '@/services/api/services/workspaces';
import useAuth from '@/services/auth/use-auth';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import React, { use } from 'react';

const page = () => {
  const { user } = useAuth();
  return (
    <div>
      admin page
      <WorkspacesNav />
    </div>
  );
};

export default withPageRequiredAuth(page);
