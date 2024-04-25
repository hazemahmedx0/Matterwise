'use client';

import React, { useEffect } from 'react';
import NewWorkspaceHeader from './NewWorkspaceHeader';
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  Label,
  Text,
  Textarea,
} from '@medusajs/ui';
import { RiUpload2Line } from '@remixicon/react';

//
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePostWorkspacesService } from '@/services/api/services/workspaces';
import useAuth from '@/services/auth/use-auth';
import { useSearchParams } from 'next/navigation';
import { usePostChannelsService } from '@/services/api/services/channels';
import { useRouter } from 'next/router';

const signupErrors: { [key: string]: string } = {
  'title should not be empty': 'title should not be empty',
  usernameAlreadyExists: 'Username already exists',
};

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
export const NewWorkspaceStep3 = ({
  setStep,
}: {
  setStep: (arg: number) => void;
}) => {
  const searchParams = useSearchParams();

  if (!searchParams.has('workspace')) {
    // window.history.back();
  }

  const UserData = useAuth();
  const userId = UserData.user?.id;

  const fetchPostChannels = usePostChannelsService();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<NewChannelFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspace: {
        id: Number(searchParams.get('workspace')),
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
    setValue('members', [{ id: userId || 3433 }]);
    const { data: dataWorkspace, status: statusWorkspace } =
      await fetchPostChannels(formData);

    if (statusWorkspace === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(dataWorkspace.errors) as Array<keyof NewChannelFormData>
      ).forEach((key) => {
        setError(key, { message: signupErrors[dataWorkspace.errors[key]] });
      });
      return;
    }

    if (statusWorkspace === HTTP_CODES_ENUM.CREATED) {
      // setStep(3);
    }
  };

  return (
    <form
      className="flex w-full flex-col  gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <NewWorkspaceHeader
        title="Create your first channel"
        stepNumber="2"
        goBack={() => setStep(1)}
      />

      {/* Inputs */}

      <div className="flex w-full flex-col gap-6">
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
            className="my-1 rounded-lg "
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

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          Next
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="transparent"
          onClick={() => setStep(3)}
        >
          Skip for now
        </Button>
      </div>
    </form>
  );
};

export default NewWorkspaceStep3;
