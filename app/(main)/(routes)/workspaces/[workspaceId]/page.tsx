'use client';
import useModals from '@/hooks/use-modal-store';
import React from 'react';

const page = ({ params }) => {
  const { onOpen } = useModals();
  return <div onClick={() => onOpen('createWorkspace')}>papdssdsapap</div>;
};

export default page;
