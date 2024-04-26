'use client';
import {
  Button,
  FocusModal,
  Input,
  Label,
  Text,
  Textarea,
  Select,
} from '@medusajs/ui';
import React, { useState } from 'react';

//
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import useAuth from '@/services/auth/use-auth';
import { useParams, useSearchParams } from 'next/navigation';
import { usePostChannelsService } from '@/services/api/services/channels';
import { useRouter } from 'next/navigation';
import { RiAddBoxFill, RiAddLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import Chips from '../ui/Chips';

export const schema = z.object({
  title: z.string(),
  description: z.string(),
  workspace: z.object({
    id: z.number(),
  }),
  type: z.object({
    id: z.number(),
  }),
  members: z.array(
    z.object({
      id: z.number(),
    }),
  ),
});

type NewChannelFormData = z.infer<typeof schema>;

const InviteUsersModal = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);
  const UserData = useAuth();
  const userId = UserData.user?.id;

  const fetchPostChannels = usePostChannelsService();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<NewChannelFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspace: {
        id: Number(searchParams.workspaceId),
      },
      type: {
        id: 1,
      },
      members: [
        {
          id: userId || 565,
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<NewChannelFormData> = async (formData) => {
    setValue('members', [{ id: userId || 1 }]);
    setValue('workspace.id', workspaceId);

    const { data: dataChannel, status: statusChannel } =
      await fetchPostChannels(formData);

    if (statusChannel === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(dataChannel.errors) as Array<keyof NewChannelFormData>
      ).forEach((key) => {
        setError(key, { message: dataChannel.errors[key] });
      });
      return;
    }

    if (statusChannel === HTTP_CODES_ENUM.CREATED) {
      router.push(`/workspaces/${workspaceId}/channels/${dataChannel.id}`);
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      reset();
      setOpen(false);
      // setStep(3);
    }
  };

  const TypeValueChanged = (e: string) => {
    setValue('type.id', Number(e));
  };

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger className="w-full">
        <div className={`nav-list-item flex h-7 w-full items-center  px-5`}>
          <RiAddLine size={16} />
          <Text leading="compact" size="small" className=" ml-1.5 truncate">
            Add People{' '}
          </Text>
        </div>
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
          <Chips
            save={(chips) => {
              console.log(chips);
            }}
          />
          <Button className=" self-end ">Invite</Button>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InviteUsersModal;
