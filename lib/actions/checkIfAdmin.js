import { useGetWorkspaceService } from '../../services/api/services/workspaces';

export const userIsAdmin = async (userId, workspaceId) => {
  const fetchGetWorkspace = useGetWorkspaceService();
  const workspace = await fetchGetWorkspace(workspaceId);
  if (workspace?.owner.id === userId) {
    return true;
  }
  return false;
};
