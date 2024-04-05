'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { ModalType, ModalsContext } from './use-modal-store';
import { CreateWorkspaceModal } from './create-workspace-modal';

export default function ModalsProvider(props: PropsWithChildren<{}>) {
  const [isMounted, setIsMounted] = useState(false);

  const [type, setType] = useState<ModalType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = (type: ModalType) => {
    setType(type);
    setIsOpen(true);
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
