import { useFileUploadService } from '@/services/api/services/files';
import { FileEntity } from '@/services/api/types/file-entity';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { Avatar, Button, Container, Text } from '@medusajs/ui';
import Image from 'next/image';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

type AvatarInputProps = {
  error?: string;
  onChange: (value: FileEntity | null) => void;
  onBlur: () => void;
  value?: FileEntity;
  disabled?: boolean;
  spaceName?: string;
};

function AvatarInput(props: AvatarInputProps) {
  const { onChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log('accre___', acceptedFiles);
      setIsLoading(true);
      const { status, data } = await fetchFileUpload(acceptedFiles[0]);
      if (status === HTTP_CODES_ENUM.CREATED) {
        onChange(data.file);
      }
      setIsLoading(false);
    },
    [fetchFileUpload, onChange],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB
    disabled: isLoading || props.disabled,
  });

  const removeAvatarHandle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onChange(null);
  };

  return (
    <Container {...getRootProps()} className="relative flex gap-4">
      {isDragActive && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full content-center items-center justify-center  bg-black/20">
          Drop the image here
        </div>
      )}
      {props?.value ? (
        <>
          <Image
            // fallback="x"
            alt={props?.spaceName ? props?.spaceName : 'Avatar'}
            src={props?.value?.path || ''}
            width={60}
            height={60}
            className=" overflow-hidden rounded-lg object-cover"
          />
        </>
      ) : null}
      <div>
        <Text className="mb-2">{props?.spaceName}</Text>
        <Button isLoading={isDragActive}>Uplaod image </Button>
        <input {...getInputProps()} />
      </div>
      {props.error && <div>error </div>}
    </Container>
  );
}

function FormAvatarInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> & {
    disabled?: boolean;
    spaceName?: string;
  },
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <AvatarInput
          spaceName={props.spaceName}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          error={fieldState.error?.message}
          disabled={props.disabled}
        />
      )}
    />
  );
}

export default FormAvatarInput;
