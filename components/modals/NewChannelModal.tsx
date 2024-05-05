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

const NewChannelModal = () => {
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
          id: userId ? userId : 1,
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<NewChannelFormData> = async (formData) => {
    await setValue('members', [{ id: userId || 1 }]);
    setValue('workspace.id', workspaceId);
    console.log('formdata', formData);

    const { data: dataChannel, status: statusChannel } =
      await fetchPostChannels(formData);

    if (statusChannel === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      console.log('error', dataChannel, statusChannel);
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
    } else {
      console.log('error');
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
            New Channel{' '}
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
            Create a channel
          </Text>
        </FocusModal.Header>
        <FocusModal.Body className=" px-6 py-5">
          <form
            className="flex w-full flex-col  gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Inputs */}

            <div className="flex w-full flex-col gap-3">
              <div>
                <Label className=" text-ui-fg-on-color" htmlFor="title">
                  Channel name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your channel name..."
                  id="title"
                  className="my-1"
                  {...register('title')}
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.title?.message}
                </Text>
              </div>
              <div>
                <Label className=" text-ui-fg-on-color" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  placeholder="Enter your channel description..."
                  id="description"
                  className="mt-1 rounded-lg "
                  {...register('description')}
                  aria-invalid={errors.description ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.description?.message}
                </Text>
              </div>

              <div>
                <Label className=" text-ui-fg-on-color" htmlFor="description">
                  Channel type
                </Label>
                <Select
                  defaultValue="1"
                  onValueChange={(e) => TypeValueChanged(e)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select the channel type" />
                  </Select.Trigger>
                  <Select.Content className="mt-1">
                    {channelType.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>{' '}
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.description?.message}
                </Text>
              </div>

              <Button
                className="mt-2 w-full"
                type="submit"
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default NewChannelModal;

const channelType = [
  {
    value: '1',
    label: 'Public',
  },
  {
    value: '2',
    label: 'Private',
  },
];
