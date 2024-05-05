'use client';
import React, { use, useEffect, useMemo, useState } from 'react';

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
import { Message as MsgType } from '@/types/message-types';

const page = () => {
  const { channelId } = useParams();
  const { socket, isConnected } = useSocket();
  const fetchGetChannel = useGetChannelService();
  const [channel, setChannel] = useState<Channel>();
  const router = useRouter();
  const params = useParams();
  const [socketMsg, setSocketMsg] = React.useState<MsgType[]>([]);
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
            id: params.channelId,
          },
          workspace: {
            id: params.workspaceId,
          },
        },
      },
      (response: any) => {
        const tempmsg = socketMsg;
        setSocketMsg([response.data.message, ...tempmsg]);
      },
    );
  };

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

  socket.on('message_sent', (data: any) => {
    const tempmsg = socketMsg;
    setSocketMsg([data, ...tempmsg]);
  });

  return (
    <div className=" flex max-h-screen min-h-screen flex-col justify-between">
      <ChatHeader>
        <ChannelDataSettingsModal channelData={channel}>
          <ChatHeader.Title>
            <ChatHeader.Icon />
            {channel?.title}
          </ChatHeader.Title>
        </ChannelDataSettingsModal>
        <ChatHeader.Actions workspaceMembers={channel?.members} />
      </ChatHeader>
      <div id="style-1" className="  flex-1 grow overflow-auto ">
        <Message socketMsg={socketMsg} />
      </div>
      <div className="  px-5 py-2">
        <div className=" rounded-xl border border-ui-border-base bg-ui-bg-field p-1.5">
          <Tiptap handelsend={handelsend} />
        </div>
      </div>
    </div>
  );
};

export default withPageRequiredAuth(page);
