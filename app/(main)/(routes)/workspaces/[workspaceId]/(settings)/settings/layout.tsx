'use client';
import SettingsSideNav from '@/components/settingsSideNav/SettingsSideNav';
import SideNav from '@/components/sideNav/SideNav';

import { RiDraggable } from '@remixicon/react';

import React, { Children, useEffect, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const MainLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) => {
  console.log('paramslayout', params.workspaceId);

  return (
    <PanelGroup
      className="h-screen min-h-full bg-ui-bg-base text-ui-fg-base"
      autoSaveId="mainScreen"
      direction="horizontal"
    >
      <Panel order={1} defaultSizePercentage={25} className="h-screen">
        <SettingsSideNav workspaceId={params.workspaceId as string} />
      </Panel>
      <PanelResizeHandle className="bg-border focus-visible:ring-ring relative flex w-px items-center justify-center bg-ui-bg-subtle-pressed after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90">
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
          <RiDraggable className="h-2.5 w-2.5" />
        </div>
      </PanelResizeHandle>
      <Panel order={2} className="flex justify-center">
        <div className="min-h-sreen  mt-5  flex w-full max-w-2xl justify-center ">
          {children}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default MainLayout;
