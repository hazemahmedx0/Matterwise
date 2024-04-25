'use client';
import ChatHeader from '@/components/chat/ChatHeader';
import Message from '@/components/chat/Message';
import ChannelDataSettingsModal from '@/components/modals/ChannelDataSettingsModal';
import Tiptap from '@/components/tiptap/Tiptap';
import { useGetChannelService } from '@/services/api/services/channels';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import { Channel } from '@/types/channels-types';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const page = () => {
  const { channelId } = useParams();
  const fetchGetChannel = useGetChannelService();
  const [channel, setChannel] = useState<Channel>();
  const router = useRouter();
  const getChannel = useMemo(async () => {
    const { status, data } = await fetchGetChannel({ id: Number(channelId) });
    if (status) {
      if (status === HTTP_CODES_ENUM.OK) {
        setChannel(data);
        return;
      } else if (status === HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR) {
        router.push('/');
      } else {
        router.push('/');
      }
      return;
    }
  }, [channelId]);

  return (
    <div className=" flex min-h-screen flex-col justify-between">
      <ChatHeader>
        <ChannelDataSettingsModal channelData={channel}>
          <ChatHeader.Title>
            <ChatHeader.Icon />
            {channel?.title}
          </ChatHeader.Title>
        </ChannelDataSettingsModal>
        <ChatHeader.Actions workspaceMembers={channel?.members} />
      </ChatHeader>
      <div className=" h-full flex-1 ">
        <Message />
      </div>
      <div>
        <Tiptap />
      </div>
    </div>
  );
};

export default withPageRequiredAuth(page);
