'use client';

import React, { useMemo } from 'react';
import {
  useWorkspacesListQuery,
  workspacesQueryKeys,
} from '../../lib/queries/workspaces-queries';
import { Workspace, Workspaces } from '@/types/workspace-types';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';

const WorkspacesNav = () => {
  const { data } = useWorkspacesListQuery();

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Workspace[]) ??
      ([] as Workspace[]);

    return removeDuplicatesFromArrayObjects(result, 'id');
  }, [data]);

  //   const result =
  //     (data?.pages.flatMap((page) => page?.data) as unknown as Workspace[]) ??
  //     ([] as Workspace[]);
  return <div>WorkspacesNav</div>;
};

export default WorkspacesNav;
