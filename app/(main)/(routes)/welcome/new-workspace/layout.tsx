import LogoSVG from '@/components/LogoSVG';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full  flex-col items-center justify-between bg-ui-bg-subtle py-4">
      <LogoSVG className=" mb-6 w-10" />
      <section className=" flex h-full max-h-[640px] w-full max-w-[1136px] flex-grow overflow-hidden rounded-lg border border-ui-border-base">
        {children}
      </section>

      <p></p>
    </main>
  );
}

export default layout;
