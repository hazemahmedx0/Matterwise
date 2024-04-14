'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { ModalData, ModalType, ModalsContext } from './use-modal-store';
import { CreateWorkspaceModal } from '../modals/create-workspace-modal';

export default function ModalsProvider(props: PropsWithChildren<{}>) {
  const [isMounted, setIsMounted] = useState(false);

  const [type, setType] = useState<ModalType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState<ModalData | null>(null);

  const onOpen = ({
    type,
    data,
  }: {
    type: ModalType;
    data: ModalData | null;
  }) => {
    setType(type);
    setIsOpen(true);
    setData(data);
  };

  const onClose = () => {
    setType(null);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ModalsContext.Provider value={{ type, isOpen, onOpen, onClose }}>
      <CreateWorkspaceModal />
      {props.children}
    </ModalsContext.Provider>
  );
}
