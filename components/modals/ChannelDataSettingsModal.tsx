'use client';
import { FocusModal, Text, Tabs } from '@medusajs/ui';
import React, { useState } from 'react';

import { Channel } from '@/types/channels-types';
import ChannelAboutTab from '../conversations/channels/ChannelAboutTab';
import ChannelMembersTab from '../conversations/channels/ChannelMembersTab';
import ChannelSettingsTab from '../conversations/channels/ChannelSettingsTab';

type ChannelDataSettingsProps = {
  children?: React.ReactNode;
  channelData: Channel | undefined;
};

const ChannelDataSettingsModal = ({
  children,
  channelData,
}: ChannelDataSettingsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger className="">{children}</FocusModal.Trigger>
      <FocusModal.Content className="def-modal max-w-[580px]">
        <FocusModal.Header className=" flex-row-reverse">
          <Text
            as="p"
            size="base"
            leading="compact"
            className="text-ui-fg-base"
          >
            Edit Channel
          </Text>
        </FocusModal.Header>
        <FocusModal.Body className="  px-6  py-5 text-ui-fg-base">
          <Tabs defaultValue="1">
            <Tabs.List className="mb-4 flex w-full border-b pb-3">
              <Tabs.Trigger value="1" className="w-full">
                About
              </Tabs.Trigger>
              <Tabs.Trigger value="2" className="w-full">
                Members
              </Tabs.Trigger>
              <Tabs.Trigger value="3" className="w-full">
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="1">
              <ChannelAboutTab
                channelData={channelData}
                key="ChannelAboutTab"
              />
            </Tabs.Content>
            <Tabs.Content value="2">
              <ChannelMembersTab
                key="ChannelMembersTab"
                channelData={channelData}
              />
            </Tabs.Content>
            <Tabs.Content value="3">
              <ChannelSettingsTab
                channelData={channelData}
                key="ChannelSettingsTab"
              />
            </Tabs.Content>
          </Tabs>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default ChannelDataSettingsModal;
