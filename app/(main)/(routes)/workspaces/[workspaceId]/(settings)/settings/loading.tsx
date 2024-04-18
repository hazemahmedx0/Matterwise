import { RiLoader2Line } from '@remixicon/react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <RiLoader2Line size={24} className="mt-8 animate-spin text-ui-fg-muted" />
  );
}
