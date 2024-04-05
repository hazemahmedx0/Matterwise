'use client';
import { useAuthLoginService } from '@/services/api/services/auth';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import useAuthActions from '@/services/auth/use-auth-actions';
import useAuthTokens from '@/services/auth/use-auth-tokens';
import withPageRequiredGuest from '@/services/auth/with-page-required-guest';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Input, Label, Text } from '@medusajs/ui';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof schema>;

const signupErrors: { [key: string]: string } = {
  notFound: 'Email not found',
  incorrectPassword: 'Incorrect password',
};

const page = () => {
  const fetchAuthLogin = useAuthLoginService();
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (formData) => {
    const { data, status } = await fetchAuthLogin(formData);

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof SignInFormData>).forEach(
        (key) => {
          setError(key, { message: signupErrors[data.errors[key]] });
        },
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      setUser(data.user);
    }
  };

  return (
    <div className="w-[420px] min-w-20">
      <Heading
        className=" mb-10 text-center text-3xl text-ui-fg-on-color"
        level="h2"
      >
        Sign In
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-6"
      >
        <div>
          <Label className=" text-ui-fg-on-color" htmlFor="email">
            Email
          </Label>
          <Input
            type="email"
            placeholder="Enter your email"
            id="email"
            className="my-1"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          <Text
            as="p"
            size="small"
            leading="compact"
            className="text-ui-fg-error"
          >
            {errors.email?.message}
          </Text>
        </div>
        <div>
          <Label className=" text-ui-fg-on-color" htmlFor="password">
            Password
          </Label>
          <Input
            placeholder="•••••••"
            id="password"
            type="password"
            className="mt-1"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          <Text
            as="p"
            size="small"
            leading="compact"
            className="mt-1 text-ui-fg-error"
          >
            {errors.password?.message}
          </Text>
        </div>
        <Button className="w-full" type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>

        <Text className="text-ui-fg-subtle">
          Don’t have an account?{' '}
          <a href="/sign-up" className="text-ui-fg-interactive underline">
            Sign up
          </a>
        </Text>
      </form>
    </div>
  );
};

export default withPageRequiredGuest(page);
