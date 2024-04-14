import { Text } from '@medusajs/ui';
import { RiArrowLeftLine, RiArrowLeftSLine } from '@remixicon/react';
import React from 'react';

const NewWorkspaceHeader = ({
  title,
  stepNumber,
  goBack,
}: {
  title?: string;
  stepNumber?: string;
  goBack?: () => void;
}) => {
  const HandleGoBacl = () => {
    goBack && goBack();
  };

  return (
    <div className="relative flex flex-col text-ui-fg-base">
      <RiArrowLeftSLine
        className="absolute left-0 top-2 -translate-x-9 transform cursor-pointer rounded-md text-ui-fg-muted hover:bg-ui-bg-base-pressed"
        onClick={HandleGoBacl}
      />
      <Text size="small" as="span" className="text-ui-fg-muted">
        {stepNumber}/2
      </Text>
      <Text size="xlarge" as="span">
        {title}
      </Text>
    </div>
  );
};

export default NewWorkspaceHeader;
