import { useDeleteChannelService } from '@/services/api/services/channels';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { Channel } from '@/types/channels-types';
import { Button, Container, Prompt } from '@medusajs/ui';
import { RiDeleteBin7Line } from '@remixicon/react';
import React, { useState } from 'react';

const ChannelSettingsTab = ({
  channelData,
}: {
  channelData: Channel | undefined;
}) => {
  const fetchChannelDelete = useDeleteChannelService();
  const [isDelete, setIsDelete] = useState(false);
  const handleDelete = async () => {
    setIsDelete(true);
    const { status } = await fetchChannelDelete({
      id: Number(channelData?.id),
    });
    if (status === HTTP_CODES_ENUM.NO_CONTENT) {
      window.location.replace('/');
      setIsDelete(false);
    }
  };

  return (
    <div>
      {/* <div>dfsdf</div> */}

      <Prompt>
        <Prompt.Trigger asChild>
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-ui-border-danger bg-ui-tag-red-bg px-4 py-4 hover:bg-ui-tag-red-bg-hover">
            <RiDeleteBin7Line size={16} className="text-ui-tag-red" />
            Delete this channel
          </div>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Delete this channel?</Prompt.Title>
            <Prompt.Description>
              When you delete a channel, all messages from this channel will be
              removed from Slack immediately. This can’t be undone.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>Cancel</Prompt.Cancel>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDelete}
            >
              Delete channel
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </div>
  );
};

export default ChannelSettingsTab;
