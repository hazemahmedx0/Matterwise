import React from 'react';
import LogoSVG from './LogoSVG';

const LoadingLogo = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-ui-bg-subtle">
      <LogoSVG className=" mb-16 animate-pulse" />
    </main>
  );
};

export default LoadingLogo;
