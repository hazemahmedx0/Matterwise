'use client';
import React, { useEffect, useMemo, useState } from 'react';

// TYEPS
import { Channel } from '@/types/channels-types';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';

// COMPONENTS
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChannelDataSettingsModal from '@/components/modals/ChannelDataSettingsModal';
import Tiptap from '@/components/tiptap/Tiptap';

// HOOKS
import { useGetChannelService } from '@/services/api/services/channels';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/providers/socket-provider';

import withPageRequiredAuth from '@/services/auth/with-page-required-auth';

// Types
import { Message } from '@/types/message-types';

const page = () => {
  const { channelId, workspaceId } = useParams();
  const router = useRouter();
  const { socket } = useSocket();

  const [channel, setChannel] = useState<Channel>();
  const [messageSocketList, setMessageSocketList] = React.useState<Message[]>(
    [],
  );

  const fetchGetChannel = useGetChannelService();

  const handelsend = (content: string) => {
    socket.emit(
      'message_sent',
      {
        seq: 4,
        event: 'message_sent',
        data: {
          content: content,
          draft: false,
          channel: {
            id: channelId,
          },
          workspace: {
            id: workspaceId,
          },
        },
      },
      (response: any) => {
        const tempmsg = messageSocketList;
        setMessageSocketList([response.data.message, ...tempmsg]);
      },
    );
  };

  // Get the channel data

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

  // Subscrice/Join the channel room

  useEffect(() => {
    socket.emit('subscribe', {
      seq: 3,
      event: 'subscribe',
      data: {
        room_id: Number(channelId),
        room_type: 'channel',
      },
    });
  }, []);

  // Revice the message from the socket server

  socket.on('message_sent', (data: any) => {
    const tempmsg = messageSocketList;
    setMessageSocketList([data, ...tempmsg]);
  });

  return (
    <div className=" flex max-h-screen min-h-screen max-w-full flex-col justify-between overflow-hidden">
      {/* Header */}
      <ChatHeader>
        <ChannelDataSettingsModal channelData={channel}>
          <ChatHeader.Title>
            <ChatHeader.Icon />
            {channel?.title}
          </ChatHeader.Title>
        </ChannelDataSettingsModal>
        <ChatHeader.Actions workspaceMembers={channel?.members} />
      </ChatHeader>

      {/* Messages */}
      <div
        id="style-1"
        className="flex w-full flex-1 grow items-end overflow-hidden "
      >
        <ChatMessages messageSocketList={messageSocketList} />
      </div>

      {/* Input */}
      <div className="  px-5 py-2">
        <div className=" rounded-xl border border-ui-border-base bg-ui-bg-field p-1.5">
          <Tiptap handelsend={handelsend} />
        </div>
      </div>
    </div>
  );
};

export default withPageRequiredAuth(page);
