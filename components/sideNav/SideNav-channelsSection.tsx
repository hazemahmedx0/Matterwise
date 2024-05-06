import { useChannelListQuery } from '@/lib/queries/channels-queries';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { Channel } from '@/types/channels-types';
import { Text } from '@medusajs/ui';
import { RiArrowDownSFill, RiHashtag } from '@remixicon/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import NewChannelModal from '../modals/NewChannelModal';

const SideNavChannelsSection = () => {
  const [showChannels, setShowChannels] = useState(true);
  const params = useParams();

  const { data, isLoading } = useChannelListQuery({
    workspaceId: params.workspaceId.toString(),
  });

  const Channelsresult = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as unknown as Channel[]) ??
      ([] as Channel[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [data]);

  return (
    <>
      <Text
        tabIndex={0}
        leading="compact"
        size="small"
        className="mt-3 flex h-7 flex-row items-center truncate border-t border-ui-border-base px-5 pt-3 text-ui-fg-subtle"
        onClick={() => setShowChannels(!showChannels)}
      >
        <RiArrowDownSFill
          className={`mr-1.5 ${!showChannels ? '!-rotate-90' : ''}`}
          size={16}
        />
        Channels
      </Text>

      <ul
        className={`mt-2 truncate text-ui-fg-subtle ${!showChannels ? 'hidden' : null}`}
      >
        {Channelsresult?.map((channel) => (
          <li key={channel.id} className="nav-list-item">
            <Link
              replace={true}
              prefetch={false}
              href={`/workspaces/${params.workspaceId}/channels/${channel?.id.toString()}`}
              className={`nav-list-item flex h-7 items-center px-5 ${params.channelId && params.channelId === channel.id.toString() && 'nav-list-item-active'} `}
            >
              <RiHashtag size={16} />
              <Text leading="compact" size="small" className=" ml-1.5 truncate">
                {channel.title}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
      <NewChannelModal key={'channelmodal'} />
    </>
  );
};

export default SideNavChannelsSection;
