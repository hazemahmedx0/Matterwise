'use client';
import NewWorkspaceStep1 from '@/components/newWorksapce/NewWorkspaceStep1';
import NewWorkspaceStep2 from '@/components/newWorksapce/NewWorkspaceStep2';
import { Text } from '@medusajs/ui';
import React, { useState } from 'react';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import NewWorkspaceStep3 from '@/components/newWorksapce/NewWorkspaceStep3';

const NewWorkspace = () => {
  const [step, setStep] = useState<number>(1);

  return (
    <>
      <div className=" w-1/2">
        <div className="flex h-full w-full px-24 py-14 align-middle">
          {step === 1 && (
            <NewWorkspaceStep1 key={`step-1-${step}`} setStep={setStep} />
          )}
          {step === 2 && (
            <NewWorkspaceStep2 key={`step-2-${step}`} setStep={setStep} />
          )}
          {/* {step === 3 && <NewWorkspaceStep3 key={2} setStep={setStep} />}  */}

          {/* <NewWorkspaceStep1 /> */}
        </div>
      </div>

      <div
        className=" w-1/2 bg-[linear-gradient(112deg,_rgba(24,_24,_26,_0.00)_36.39%,_#000_104.79%)]
"
      >
        {' '}
      </div>
    </>
  );
};

export default withPageRequiredAuth(NewWorkspace);
