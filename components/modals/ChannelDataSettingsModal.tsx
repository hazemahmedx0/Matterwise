'use client';
import {
  Button,
  FocusModal,
  Input,
  Label,
  Text,
  Textarea,
  Select,
  Tabs,
} from '@medusajs/ui';
import React, { useState } from 'react';

//
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import useAuth from '@/services/auth/use-auth';
import { useParams, useSearchParams } from 'next/navigation';
import {
  usePatchChannelService,
  usePostChannelsService,
} from '@/services/api/services/channels';
import { useRouter } from 'next/navigation';
import { RiAddBoxFill, RiAddLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { Channel } from '@/types/channels-types';

type ChannelDataSettingsProps = {
  children?: React.ReactNode;
  channelData: Channel | undefined;
};

const ChannelDataSettingsModal = ({
  children,
  channelData,
}: ChannelDataSettingsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger className="w-full">{children}</FocusModal.Trigger>
      <FocusModal.Content className="def-modal max-w-[580px]">
        <FocusModal.Header className=" flex-row-reverse">
          <Text
            as="p"
            size="base"
            leading="compact"
            className="text-ui-fg-base"
          >
            Edit Channel
          </Text>
        </FocusModal.Header>
        <FocusModal.Body className="  px-6  py-5 ">
          <Tabs defaultValue="1">
            <Tabs.List className="mb-4 flex w-full border-b pb-3">
              <Tabs.Trigger value="1" className="w-full">
                About
              </Tabs.Trigger>
              <Tabs.Trigger value="2" className="w-full">
                Members
              </Tabs.Trigger>
              <Tabs.Trigger value="3" className="w-full">
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="1">
              <ChannelAbout channelData={channelData} key="1sss" />
            </Tabs.Content>
            <Tabs.Content value="2">Panel 2</Tabs.Content>
            <Tabs.Content value="3">Panel 3</Tabs.Content>
          </Tabs>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default ChannelDataSettingsModal;

export const schema = z.object({
  title: z.string(),
  description: z.string(),
});

type ChannelFormData = z.infer<typeof schema>;

const ChannelAbout = ({
  channelData,
}: {
  channelData: Channel | undefined;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);
  console.log('workspaceId', workspaceId);
  const UserData = useAuth();
  const userId = UserData.user?.id;

  console.log('channelData', channelData);

  const fetchPatchChannel = usePatchChannelService();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    setValue,
  } = useForm<ChannelFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: channelData?.title,
      description: channelData?.description,
    },
  });

  const onSubmit: SubmitHandler<ChannelFormData> = async (formData) => {
    if (!channelData) return;
    const { data: dataChannel, status: statusChannel } =
      await fetchPatchChannel({
        id: channelData?.id,
        data: {
          title: formData?.title,
          description: formData?.description,
        },
      });

    if (statusChannel === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(dataChannel.errors) as Array<keyof ChannelFormData>).forEach(
        (key) => {
          setError(key, { message: dataChannel.errors[key] });
        },
      );
      return;
    }

    if (statusChannel === HTTP_CODES_ENUM.CREATED) {
      queryClient.invalidateQueries({ queryKey: ['channel'] });
    }
  };

  return (
    <div className="flex text-ui-fg-base ">
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

          <Button
            className="mt-2 w-full"
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};
