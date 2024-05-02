import Image from 'next/image';
import React from 'react';
import NewWorkspaceCardImg from '@/public/newWorkspaceCard.svg';
import { Button, Text } from '@medusajs/ui';
import Link from 'next/link';
const NewWorkspaceCard = () => {
  return (
    <div className="h-fit w-full overflow-hidden rounded-lg border border-ui-border-base px-4 py-3">
      <Image src={NewWorkspaceCardImg} alt="New workspace" />
      <Text as="p" className="mt-4 px-3 text-center text-ui-fg-subtle">
        Matterwise gives your team a home - a place where they can talk and work
        together. To create a new workspace, click the button below.
      </Text>
      <Link href="/welcome/new-workspace">
        <Button className="mt-4 w-full" variant="primary" size="large">
          Create a workspace
        </Button>
      </Link>
    </div>
  );
};

export default NewWorkspaceCard;
