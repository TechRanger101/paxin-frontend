import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';

function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('size-full max-w-[320px] sm:max-w-[400px]', className)}>
      <CardContent className='relative flex size-full flex-col gap-4 p-3'>
        <div className='relative'>
          <Skeleton className='h-[300px] w-full' />
        </div>
        <div className='relative w-full max-w-[100%]'>
          <Skeleton className='size-full' />
        </div>
        <div className='relative'>
          <Skeleton className='absolute right-0 top-3 size-8 rounded-full' />
        </div>
        <div className='space-y-1'>
          <Skeleton className='size-20' />
          <Skeleton className='size-2/3' />
        </div>
        <div className='mt-auto space-y-1'>
          <Skeleton className='size-4/5' />
          <Skeleton className='size-4/5' />
        </div>
        <div className='flex gap-3'>
          <Skeleton className='h-20 w-1/2' />
          <Skeleton className='h-20 w-1/2' />
        </div>
        <Skeleton className='size-full' />
      </CardContent>
    </Card>
  );
}

export { ProfileCardSkeleton };
