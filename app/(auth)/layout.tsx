import React from 'react';
import Image from 'next/image';
import LogoSVG from '@/components/LogoSVG';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-ui-bg-subtle flex min-h-screen w-full flex-col items-center justify-center">
      <LogoSVG />
      {children}
    </main>
  );
};

export default Layout;
