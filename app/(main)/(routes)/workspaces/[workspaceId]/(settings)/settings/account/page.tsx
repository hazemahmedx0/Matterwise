'use client';
import React, { useEffect, useState } from 'react';

// Components
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import SectionHeader from '@/components/settings/SectionHeader';
import {
  Button,
  Input,
  Label,
  Text,
  Alert,
  FocusModal,
  useToast,
} from '@medusajs/ui';
import ComponentsLoading from '@/components/ComponentsLoading';
import FormAvatarInput from '@/components/form/form-avatar-input';

// Hooks
import useAuth from '@/services/auth/use-auth';
import { useAuthPatchMeService } from '@/services/api/services/auth';

// Fetch
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';

const PhotoSchema = z.object({
  id: z.string(),
  path: z.string().optional(),
});

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is too short' }),
  lastName: z.string().min(1, { message: 'Last name is too short' }),
  photo: PhotoSchema.nullable(),
});

type ProfileData = z.infer<typeof schema>;

const page = () => {
  const userData = useAuth();
  const fetchAuthPatchMe = useAuthPatchMeService();

  const [fething, setFething] = useState(false);

  const method = useForm<ProfileData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isLoading, isDirty },
  } = method;

  const onSubmit: SubmitHandler<ProfileData> = async (formData) => {
    const { data, status } = await fetchAuthPatchMe({
      firstName: formData.firstName,
      lastName: formData.lastName,
      photo: formData.photo,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof ProfileData>).forEach((key) => {
        setError(key, { message: data.errors[key] });
      });
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
    }
  };

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      if (userData) {
        reset({
          firstName: userData?.user?.firstName,
          lastName: userData?.user?.lastName,
          photo: userData?.user?.photo || null,
        });
      }
      setFething(false);
    };

    getInitialDataForEdit();
  }, [userData]);

  if (fething) {
    return <ComponentsLoading />;
  }

  return (
    <div className=" flex w-full flex-col gap-6">
      <SectionHeader title="Profile">
        <Alert className="mt-2">
          Changes to your profile will apply to all of your workspaces.
        </Alert>
      </SectionHeader>

      <div>
        <FormProvider {...method}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-stretch gap-6"
          >
            <FormAvatarInput
              {...register('photo')}
              spaceName={'Proifle image'}
            />

            <div className="flex w-full gap-3">
              <div className="w-full">
                <Label className="text-ui-fg-on-color" htmlFor="firstName">
                  First name
                </Label>
                <Input
                  type="firstName"
                  placeholder="Enter your First name"
                  id="firstName"
                  className="my-1"
                  {...register('firstName')}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.firstName?.message}
                </Text>
              </div>
              <div className="w-full">
                <Label className="text-ui-fg-on-color" htmlFor="lastName">
                  Last name
                </Label>
                <Input
                  type="lastName"
                  placeholder="Enter your Last name"
                  id="lastName"
                  className="my-1"
                  {...register('lastName')}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.lastName?.message}
                </Text>
              </div>
            </div>

            <Button
              className=""
              type="submit"
              isLoading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </Button>
          </form>
        </FormProvider>
      </div>
      <div className="h-1 w-full border-b border-ui-border-base"></div>
      <ChangePaswword />
    </div>
  );
};

export default withPageRequiredAuth(page);

const passwordSchema = z.object({
  password: z.string().min(8, { message: 'Password is too short' }),
  oldPassword: z.string(),
});

type PasswordData = z.infer<typeof passwordSchema>;

const ChangePaswword = () => {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors, isSubmitting, isLoading, isDirty },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit: SubmitHandler<PasswordData> = async (formData) => {
    if (!formData.password) {
      setError('password', { message: 'Password is required' });
      return;
    }
    const { data, status } = await fetchAuthPatchMe({
      password: formData.password,
      oldPassword: formData.oldPassword,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof PasswordData>).forEach((key) => {
        setError(key, { message: data.errors[key] });
      });
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      toast({
        title: 'Success',
        description: 'Password updated successfully',
        variant: 'success',
        duration: 5000,
      });
      setOpen(false);
    }
  };

  return (
    <div className=" flex flex-col items-end gap-3 align-middle">
      <div className="w-full">
        <Label className="text-ui-fg-on-color" htmlFor="password">
          Password
        </Label>
        <Input
          placeholder="•••••••"
          defaultValue={'•••••••'}
          disabled
          type="text"
          className="mt-1"
          id="password"
        />
      </div>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger>
          <Button variant="transparent" className="gow-1 !w-fit">
            Change Password
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content className="def-modal">
          <FocusModal.Header className=" flex-row-reverse">
            <Text
              as="p"
              size="base"
              leading="compact"
              className="text-ui-fg-base"
            >
              Change password
            </Text>
          </FocusModal.Header>
          <FocusModal.Body className=" px-6 py-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-stretch gap-6"
            >
              <div className="w-full">
                <Label className="text-ui-fg-on-color" htmlFor="password">
                  New Password
                </Label>
                <Input
                  placeholder="•••••••"
                  type="password"
                  className="mt-1"
                  id="password"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.password?.message}
                </Text>
              </div>
              <div className="w-full">
                <Label className="text-ui-fg-on-color" htmlFor="oldPassword">
                  Old password
                </Label>
                <Input
                  placeholder="•••••••"
                  type="password"
                  id="oldPassword"
                  className="mt-1"
                  {...register('oldPassword')}
                  aria-invalid={errors.oldPassword ? 'true' : 'false'}
                />
                <Text
                  as="p"
                  size="small"
                  leading="compact"
                  className="text-ui-fg-error"
                >
                  {errors.oldPassword?.message}
                </Text>
              </div>

              <Button className="" type="submit" isLoading={isSubmitting}>
                Update
              </Button>
            </form>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  );
};
