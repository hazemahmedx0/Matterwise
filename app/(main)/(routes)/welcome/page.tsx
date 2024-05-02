'use client';
import NewWorkspaceStep1 from '@/components/newWorksapce/NewWorkspaceStep1';
import NewWorkspaceStep2 from '@/components/newWorksapce/NewWorkspaceStep2';
import { Text } from '@medusajs/ui';
import React, { useState } from 'react';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import NewWorkspaceStep3 from '@/components/newWorksapce/NewWorkspaceStep3';
import LogoSVG from '@/components/LogoSVG';
import NewWorkspaceCard from '@/components/welcome/NewWorkspaceCard';
import InvitationsList from '@/components/welcome/InvitationsList';

const Welcome = () => {
  const [step, setStep] = useState<number>(1);

  return (
    <>
      <main className="flex min-h-screen w-full flex-col  items-center justify-between bg-ui-bg-subtle py-4 text-ui-fg-base">
        <LogoSVG className=" mb-6 w-10" />
        <section className=" flex h-full w-full  max-w-[420px] flex-grow flex-col overflow-hidden rounded-lg">
          <NewWorkspaceCard />
          <InvitationsList />
        </section>

        <p></p>
      </main>
    </>
  );
};

export default withPageRequiredAuth(Welcome);
