'use client';
import { Button, FocusModal, Text, useToast } from '@medusajs/ui';
import React, { useState } from 'react';

//
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { useParams } from 'next/navigation';
import Chips from '../ui/Chips';
import { usePostInviteUserService } from '@/services/api/services/workspaces';

interface Chip {
  key: string;
  email: string;
  valid?: boolean;
}

const InviteUsersModal = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [chips, setChips] = useState<Chip[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);

  function getEmails(arr: Chip[]): { emails: string[] } {
    const emails: string[] = arr.map((item) => item.email);
    return { emails };
  }

  function hasInvalid(arr: Chip[]): boolean {
    return arr.some((item) => !item.valid);
  }

  const fetchPostUserInvite = usePostInviteUserService();

  const onSubmit = async (formData: Chip[]) => {
    setLoading(true);

    const hasInvalidResult = hasInvalid(formData);

    if (hasInvalidResult) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email(s) address',
        variant: 'error',
        duration: 5000,
      });

      setLoading(false);
      return;
    }
    const EmailsList = getEmails(formData);

    const { data: invitationData, status: statusInvite } =
      await fetchPostUserInvite({
        id: workspaceId,
        data: EmailsList,
      });

    if (statusInvite === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      toast({
        title: 'Error',
        description: `${invitationData?.errors.emails}`,
        variant: 'error',
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    if (statusInvite && statusInvite === HTTP_CODES_ENUM.ACCEPTED) {
      toast({
        title: 'Success',
        description: `you have invited ${EmailsList.emails.length} people to the workspace`,
        variant: 'success',
        duration: 5000,
      });

      setChips([]);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger className={`${className}`}>
        {children}
      </FocusModal.Trigger>
      <FocusModal.Content className="def-modal ">
        <FocusModal.Header className=" flex-row-reverse">
          <Text
            as="p"
            size="base"
            leading="compact"
            className="text-ui-fg-base"
          >
            Invite People
          </Text>
        </FocusModal.Header>
        <FocusModal.Body className=" flex flex-col gap-1 px-6 py-5 ">
          <Text
            size="small"
            leading="compact"
            className="mb-1 text-ui-fg-subtle"
          >
            Enter the email address of the people you want to invite
          </Text>
          <Chips
            save={(chips) => {
              setChips(chips);
            }}
          />
          <div className="flex justify-between">
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              Click enter to add the email
            </Text>
            <Button
              className="self-end"
              onClick={() => onSubmit(chips)}
              isLoading={loading}
            >
              Invite
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InviteUsersModal;
