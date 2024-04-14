import React from 'react';

function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return <div>{children}</div>;
}

export default layout;
