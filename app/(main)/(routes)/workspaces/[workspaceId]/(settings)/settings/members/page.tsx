'use client';
import SectionHeader from '@/components/settings/SectionHeader';
import {
  Button,
  Input,
  Label,
  Text,
  Textarea,
  Prompt,
  Table,
} from '@medusajs/ui';
import React, {
  ElementRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';

import { z } from 'zod';
import {
  useGetWorkspaceService,
  usePatchWorkspaceService,
} from '@/services/api/services/workspaces';
import { useParams } from 'next/navigation';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import { zodResolver } from '@hookform/resolvers/zod';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import { RiLoader2Line, RiUserAddLine } from '@remixicon/react';
import { useUsersListQuery } from '@/lib/queries/users-queries';
import { User } from '@/services/api/types/user';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';

const page = () => {
  const searchParams = useParams();
  const workspaceId = Number(searchParams.workspaceId);
  const {
    data: usersdata,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUsersListQuery({
    workspaceId: workspaceId.toString(),
  });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const usersresult = useMemo(() => {
    const result =
      (usersdata?.pages.flatMap((page) => page?.data) as unknown as User[]) ??
      ([] as User[]);
    if (result.at(0) !== undefined && result.length > 0) {
      return removeDuplicatesFromArrayObjects(result, 'id');
    }
  }, [usersdata]);

  const [fething, setFething] = useState(false);

  console.log('usersresult');

  const [loadMoreRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  if (entry?.isIntersecting && hasNextPage) {
    console.log('entry', entry);
    handleScroll();
  }

  if (fething) {
    return (
      <RiLoader2Line size={24} className="mt-8 animate-spin text-ui-fg-muted" />
    );
  }

  return (
    <div className=" flex w-full flex-col gap-6 ">
      <SectionHeader
        title="Members"
        subtitle="Manage who has access to this workspace"
      ></SectionHeader>

      <div>
        <div className="mb-5 flex w-full justify-between gap-4">
          <div className="w-full">
            <Input placeholder="Search" id="search-input" type="search" />
          </div>
          <Button className=" min-w-max">
            <RiUserAddLine size={16} className=" !h-4 !w-4" />
            Add
          </Button>
        </div>
      </div>

      <Table>
        <Table.Header className=" sticky">
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {usersresult?.map((user) => {
            return (
              <Table.Row
                key={user.id}
                className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
              >
                <Table.Cell>
                  {user.firstName} {user.lastName}
                </Table.Cell>
                <Table.Cell>{user?.role?.name}</Table.Cell>
                <Table.Cell className="text-right">
                  <Button className="text-ui-fg-muted">Remove</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div
        ref={loadMoreRef}
        className={`h-4 ${!hasNextPage ? 'hidden' : null}`}
      />
    </div>
  );
};

export default withPageRequiredAuth(page);
