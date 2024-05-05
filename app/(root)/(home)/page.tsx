'use client';
import LoadingLogo from '@/components/LoadingLogo';
import { useWorkspacesListQuery } from '@/lib/queries/workspaces-queries';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { useCurrentWorkspace } from '@/store/currentworkspaceStore';
import { Workspace } from '@/types/workspace-types';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const { data, isLoading } = useWorkspacesListQuery();
  const [loading, setLoading] = useState(false);
  // const setCurrentWorkspace = useCurrentWorkspace(
  //   (state) => state.setWorkspace,
  // );
  const result = useMemo(() => {
    setLoading(true);
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Workspace[]) ??
      ([] as Workspace[]);
    setLoading(false);
    if (result && result.length > 0 && !isLoading) {
      // console.log('result___', result);
      router.push(`/workspaces/${result[0]?.id}`);
    } else if (!isLoading) {
      router.push(`/welcome/new-workspace`);
    }
    return removeDuplicatesFromArrayObjects(result, 'id');
  }, [data]);

  // useEffect(() => {
  //   handleResultChange(result);
  // }, [result, handleResultChange]);

  if (isLoading || loading) {
    return <LoadingLogo />;
  }
  return <LoadingLogo />;
};

export default withPageRequiredAuth(Home);

// TODO
//  Add onboarding for 0 workspaces
// Add loading state
// Try to pass panels width to the workspace page

// const localStorageValue = localStorage.getItem('PanelGroup:sizes:mainScreen');
// let widthPercentages: number[] = [];
// if (localStorageValue) {
//   const parsedValue = JSON.parse(localStorageValue);
//   widthPercentages = parsedValue["1:{\"defaultSizePercentage\":25},2:{}"];
// }
