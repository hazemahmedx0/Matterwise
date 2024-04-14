import { Text } from '@medusajs/ui';
import React from 'react';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, children }: SectionHeaderProps) => {
  return (
    <div
      className={`border-b border-ui-border-base ${children ? 'pb-5' : 'pb-2'}`}
    >
      {title && <Text size="xlarge">{title}</Text>}
      {subtitle && (
        <Text size="small" className=" mb-3 text-ui-fg-muted ">
          {subtitle}
        </Text>
      )}
      {children}
    </div>
  );
};

export default SectionHeader;
