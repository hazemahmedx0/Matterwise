'use client';

import React, { useCallback } from 'react';
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
import { FormProvider, SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePostWorkspacesService } from '@/services/api/services/workspaces';
import useAuth from '@/services/auth/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import WorkspaceAvatarInput from '../form/workspace-form-avatar-input';

const signupErrors: { [key: string]: string } = {
  'title should not be empty': 'title should not be empty',
  usernameAlreadyExists: 'Username already exists',
};

const PhotoSchema = z.object({
  id: z.string(),
});

const schema = z.object({
  title: z.string().min(1, {
    message: "Can't be empty!",
  }),
  description: z.string(),
  photo: PhotoSchema.nullable().optional(),
});
type NewWorspaceFormData = z.infer<typeof schema>;

const NewWorkspaceStep1 = ({ setStep }: { setStep: (arg: number) => void }) => {
  const UserData = useAuth();
  const email = UserData.user?.email;
  const domain = email ? email.substring(email.indexOf('@')) : '';

  const router = useRouter();

  const fetchPostWorkspaces = usePostWorkspacesService();
  const method = useForm<NewWorspaceFormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = method;

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const onSubmit: SubmitHandler<NewWorspaceFormData> = async (formData) => {
    const { data: dataWorkspace, status: statusWorkspace } =
      await fetchPostWorkspaces(formData);

    if (statusWorkspace === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(dataWorkspace.errors) as Array<keyof NewWorspaceFormData>
      ).forEach((key) => {
        setError(key, { message: signupErrors[dataWorkspace.errors[key]] });
      });
      return;
    }

    if (statusWorkspace === HTTP_CODES_ENUM.CREATED) {
      router.push(
        '?' +
          createQueryString('step', 2 as any) +
          '&' +
          createQueryString('workspace', dataWorkspace.id as any),
      );

      setStep(2);
    }
  };

  return (
    <FormProvider {...method}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <NewWorkspaceHeader
          title="Create your workspace"
          stepNumber="1"
          goBack={() => window.history.back()}
        />

        <WorkspaceAvatarInput {...register('photo')} />

        <div className="flex flex-col gap-4">
          <div>
            <Label className=" text-ui-fg-base" htmlFor="title">
              Company name
            </Label>
            <Input
              type="text"
              placeholder="Enter your company name..."
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
            <Label className=" text-ui-fg-base" htmlFor="description">
              Description
            </Label>
            <Textarea
              placeholder="Enter your company description..."
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

          <div className="flex items-start space-x-2 text-ui-fg-subtle">
            <Checkbox id="billing-shipping" /> {/* TODO */}
            <Label htmlFor="billing-shipping">
              let anyone with an <span className=" font-bold">{domain}</span>{' '}
              email join this workspace
            </Label>
          </div>
          <Button className="w-full" type="submit" isLoading={isSubmitting}>
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewWorkspaceStep1;
