import { Button, Input, Label, Text, Textarea } from '@medusajs/ui';
import React, { useState } from 'react';

//
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePatchChannelService } from '@/services/api/services/channels';
import { useQueryClient } from '@tanstack/react-query';
import { Channel } from '@/types/channels-types';

export const schema = z.object({
  title: z.string(),
  description: z.string(),
});

type ChannelFormData = z.infer<typeof schema>;

const ChannelAboutTab = ({
  channelData,
}: {
  channelData: Channel | undefined;
}) => {
  const queryClient = useQueryClient();

  const fetchPatchChannel = usePatchChannelService();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
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

    if (statusChannel === HTTP_CODES_ENUM.OK) {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
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

export default ChannelAboutTab;
