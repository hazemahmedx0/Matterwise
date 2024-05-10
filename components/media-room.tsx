'use client';
import { Track } from 'livekit-client';

import { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  FocusLayout,
} from '@livekit/components-react';
import '@livekit/components-styles';
import useAuth from '@/services/auth/use-auth';
import { RiLoader2Line } from '@remixicon/react';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useAuth();
  const [token, setToken] = useState('');
  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === '') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <RiLoader2Line className="animate-spin text-2xl text-zinc-500 dark:text-zinc-400" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      {/* <FocusLayout> */}
      <VideoConference />
      {/* </FocusLayout> */}
    </LiveKitRoom>
  );
};
