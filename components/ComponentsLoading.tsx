import React from 'react';
import { RiLoader2Line } from '@remixicon/react';

const ComponentsLoading = () => {
  return (
    <main className="flex  w-full flex-col items-center justify-center ">
      <RiLoader2Line size={24} className="mt-8 animate-spin text-ui-fg-muted" />
    </main>
  );
};

export default ComponentsLoading;
