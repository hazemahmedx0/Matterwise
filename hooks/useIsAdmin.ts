'use client';
import { useGetWorkspaceService } from '@/services/api/services/workspaces';
import useAuth from '@/services/auth/use-auth';
import { Workspace } from '@/types/workspace-types';
import { useState, useEffect } from 'react';

const useIsAdmin = (workspaceId: string | undefined): boolean => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const fetchGetWorkspace = useGetWorkspaceService();
  const userData = useAuth();
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (workspaceId && userData?.user?.id) {
        try {
          const { data, status } = await fetchGetWorkspace({
            id: Number(workspaceId),
          });
          // @ts-ignore
          setIsAdmin(data?.owner?.id === userData?.user?.id);
        } catch (error) {}
      }
    };

    checkAdminStatus();
  }, [userData, workspaceId, fetchGetWorkspace]);

  return isAdmin;
};

export default useIsAdmin;
