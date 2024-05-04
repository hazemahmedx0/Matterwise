'use client';
import React, { useMemo, useState } from 'react';

// TYEPS
import { Channel } from '@/types/channels-types';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';

// COMPONENTS
import ChatHeader from '@/components/chat/ChatHeader';
import Message from '@/components/chat/Message';
import ChannelDataSettingsModal from '@/components/modals/ChannelDataSettingsModal';
import Tiptap from '@/components/tiptap/Tiptap';

// HOOKS
import { useGetChannelService } from '@/services/api/services/channels';
import { useParams, useRouter } from 'next/navigation';

import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import { Button } from '@medusajs/ui';
import { useSocket } from '@/providers/socket-provider';

const page = () => {
  const { channelId } = useParams();
  const socket = useSocket();
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

  const sendsend = () => {
    socket.socket.emit('subscribe', {
      seq: 3,
      event: 'subscribe',
      data: {
        room_id: 1,
        room_type: 'channel',
      },
    });

    socket.socket.emit('message_sent', {
      seq: 4,
      event: 'message_sent',
      data: {
        content: 'test sending message on socket',
        draft: false,
        channel: {
          id: 1,
        },
        workspace: {
          id: 1,
        },
      },
    });
    console.log('send');
  };

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
        <Button onClick={sendsend}>Send</Button>
        <p>{socket.isConnected ? 'ss' : 'no'}</p>
      </div>
      <div className="  px-5 py-2">
        <div className=" rounded-xl border border-ui-border-base bg-ui-bg-field p-1.5">
          <Tiptap />
        </div>
      </div>
    </div>
  );
};

export default withPageRequiredAuth(page);
