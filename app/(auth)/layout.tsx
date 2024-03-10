import React from 'react';
import Image from 'next/image';
import LogoSVG from '@/components/LogoSVG';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-ui-bg-subtle">
      <LogoSVG className=" mb-16" />
      {children}
    </main>
  );
};

export default Layout;
