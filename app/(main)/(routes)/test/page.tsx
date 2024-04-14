import Chips from '@/components/ui/Chips';
import { Input, Textarea } from '@medusajs/ui';
import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen  flex-col content-center justify-center  bg-ui-bg-subtle  pt-48 align-middle">
      <div className="flex w-1/2 flex-col content-center pl-9 align-middle">
        <Chips />
      </div>
    </div>
  );
}

// Todo
// complete
