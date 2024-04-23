'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Components
import { Button, Input, Label, Text, Textarea, Prompt } from '@medusajs/ui';
import SectionHeader from '@/components/settings/SectionHeader';
import FormAvatarInput from '@/components/form/form-avatar-input';

// Hooks
import {
  useDeleteWorkspaceService,
  useGetWorkspaceService,
  usePatchWorkspaceService,
} from '@/services/api/services/workspaces';

// Fetch
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';

import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import ComponentsLoading from '@/components/ComponentsLoading';

const PhotoSchema = z.object({
  id: z.string(),
  path: z.string().optional(),
});

const schema = z.object({
  title: z.string(),
  description: z.string(),
  photo: PhotoSchema.nullable(),
});

type WorkspaceFormData = z.infer<typeof schema>;

const page = () => {
  const fetchGetWorkspace = useGetWorkspaceService();
  const fetchPatchWorkspace = usePatchWorkspaceService();

  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);

  const [fething, setFething] = useState(false);

  const method = useForm<WorkspaceFormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isLoading },
    getValues,
  } = method;

  const onSubmit: SubmitHandler<WorkspaceFormData> = async (formData) => {
    console.log('submitting', formData);
    const { data, status } = await fetchPatchWorkspace({
      id: workspaceId,
      data: {
        title: formData.title,
        description: formData.description,
        photo: formData.photo,
      },
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof WorkspaceFormData>).forEach(
        (key) => {
          setError(key, { message: data.errors[key] });
        },
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      console.log('success');
      console.log(data);
    }
  };

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      setFething(true);
      const { status, data: workspace } = await fetchGetWorkspace({
        id: workspaceId,
      });
      console.log('wowowowow', workspace);
      if (status === HTTP_CODES_ENUM.OK) {
        console.log('vals', workspace);
        reset({
          title: workspace?.title ?? '',
          description: workspace?.description ?? '',
          photo: workspace?.photo ?? undefined,
        });
      }
      setFething(false);
    };

    getInitialDataForEdit();
  }, [workspaceId, fetchGetWorkspace]);

  if (fething) {
    return <ComponentsLoading />;
  }

  return (
    <div className=" flex w-full flex-col gap-6">
      <SectionHeader
        title="General"
        subtitle="Manage your workspace settings"
      ></SectionHeader>
      <div>
        <FormProvider {...method}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch gap-6"
          >
            <FormAvatarInput {...register('photo')} />

            <div>
              <Label className=" text-ui-fg-on-color" htmlFor="title">
                Title
              </Label>
              <Input
                type="title"
                placeholder="Enter your title"
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
            <Button className="" type="submit" isLoading={isSubmitting}>
              Update
            </Button>
          </form>
        </FormProvider>
      </div>
      <div className="h-1 w-full border-b border-ui-border-base"></div>
      <DeleteWorkspace />
    </div>
  );
};

export default withPageRequiredAuth(page);

const DeleteWorkspace = () => {
  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);
  const [open, setOpen] = useState(false);
  const [slugInput, setSlugInput] = useState('');
  const [slugInputError, setSlugInputError] = useState('');
  const fetchWorkspaceDelete = useDeleteWorkspaceService();

  const handleDelete = async () => {
    if (Number(slugInput) === workspaceId) {
      const { status } = await fetchWorkspaceDelete({
        id: workspaceId,
      });
      if (status === HTTP_CODES_ENUM.NO_CONTENT) {
        window.location.replace('/');

        setOpen(false);
      }
    } else {
      console.log('slug does not match');
      setSlugInputError('Slug does not match');
    }
  };

  return (
    <div className=" flex flex-col gap-3">
      <Text as="p" size="base" leading="compact" className="text-ui-fg-error">
        Delete workspace
      </Text>
      <Text as="p" size="small" leading="compact" className="text-ui-fg-muted">
        If you want to permanently delete this workspace and all of its data,
        including but not limited to users, issues, and comments, you can do so
        below.
      </Text>

      <Prompt open={open}>
        <Prompt.Trigger asChild>
          <Button onClick={() => setOpen(true)} variant="danger">
            Permanently delete workspace
          </Button>
        </Prompt.Trigger>
        <Prompt.Content className="max-w-[600px]">
          <Prompt.Header>
            <Prompt.Title>Are you sure?</Prompt.Title>
            <Prompt.Description>
              By deleting your workspace you and your team will lose access to
              this Attio workspace and all data will be lost. This is a
              permanent action and cannot be undone.
              <div className="mt-3">
                <Label className=" text-ui-fg-on-color" htmlFor="slug">
                  Please type your workspace slug '{workspaceId}' below to
                  confirm deletion.
                </Label>
                <Input
                  type="slug"
                  placeholder="Enter your slug"
                  id="slug"
                  className="my-1"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {slugInputError}
                </Text>
              </div>
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => setOpen(false)}>Cancel</Prompt.Cancel>
            <Prompt.Action onClick={() => handleDelete()}>Delete</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </div>
  );
};
