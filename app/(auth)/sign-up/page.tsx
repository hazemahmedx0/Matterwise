'use client';
import {
  useAuthLoginService,
  useAuthSignUpService,
} from '@/services/api/services/auth';
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
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof schema>;

const signupErrors: { [key: string]: string } = {
  emailAlreadyExists: 'Email already exists',
};

const page = () => {
  const fetchAuthSignUp = useAuthSignUpService();
  const fetchAuthLogin = useAuthLoginService();
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (formData) => {
    const { data: dataSignUp, status: statusSignUp } =
      await fetchAuthSignUp(formData);

    console.log(dataSignUp, statusSignUp);

    if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach(
        (key) => {
          setError(key, { message: signupErrors[dataSignUp.errors[key]] });
        },
      );
      return;
    }

    const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
      email: formData.email,
      password: formData.password,
    });

    console.log(errors);
    console.log(dataSignIn, statusSignIn);

    if (statusSignIn === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: dataSignIn.token,
        refreshToken: dataSignIn.refreshToken,
        tokenExpires: dataSignIn.tokenExpires,
      });
      setUser(dataSignIn.user);
    }
  };

  return (
    <div className="w-[420px] min-w-20">
      <Heading
        className=" mb-10 text-center text-3xl text-ui-fg-on-color"
        level="h2"
      >
        Sign Up
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-6"
      >
        <div className="flex w-full  flex-row items-stretch gap-4">
          <div className="w-full ">
            <Label className=" text-ui-fg-on-color" htmlFor="firstName">
              First name
            </Label>
            <Input
              {...register('firstName')}
              placeholder="John"
              id="firstName"
              className="mt-1 w-full"
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
            <Label className=" text-ui-fg-on-color" htmlFor="lastName">
              Last name
            </Label>
            <Input
              {...register('lastName')}
              placeholder="Doe"
              id="lastName"
              className="mt-1 w-full"
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
          <Label className=" text-ui-fg-on-color" htmlFor="username">
            User name
          </Label>
          <Input
            type="text"
            placeholder="Enter your email"
            id="userName"
            className="my-1"
            {...register('username')}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
          <Text
            as="p"
            size="small"
            leading="compact"
            className="text-ui-fg-error"
          >
            {errors.username?.message}
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
          Sign Up
        </Button>

        <Text className="text-ui-fg-subtle">
          By clicking on 'Sign up' above, you are agreeing to the
          <span className="text-ui-fg-interactive underline">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-ui-fg-interactive underline">
            Privacy Policy
          </span>
        </Text>

        <Text className="text-ui-fg-subtle">
          Already have an account?{' '}
          <a href="/sign-in" className="text-ui-fg-interactive underline">
            Sign in
          </a>
        </Text>
      </form>
    </div>
  );
};

export default withPageRequiredGuest(page);

// TODOs: Change to URLs
