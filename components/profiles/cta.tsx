import { FaHardDrive, FaSackDollar, FaUserClock } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';

import { PaxContext } from '@/context/context';
import { useContext } from 'react';
import { PlanUpgradeModal } from './plan-upgrade-modal';
import Link from 'next/link';

interface CTAProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
}

export default function CTASection({ title, description, icon }: CTAProps) {
  const { user } = useContext(PaxContext);
  const Icon = icon;

  return (
    <div className='flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2'>
        <div className='rounded-full bg-primary/10 p-3 text-primary'>
          <Icon className='size-5' />
        </div>
        <div>
          <div className='text-lg font-semibold'>{title}</div>
          <div className='hidden text-sm text-muted-foreground lg:block'>
            {description || ''}
          </div>
        </div>
        <PlanUpgradeModal>
          <Button variant='outline' className='ml-auto sm:hidden'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal>
      </div>
      <div className='flex gap-2'>
        <PlanUpgradeModal>
          <Button variant='outline' className='hidden w-full sm:flex'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal>
        <Button variant='outline' className='w-full' asChild>
          <Link href='/profile/setting?tab=accounting'>
            <FaSackDollar className='mr-2 size-4' />
            {user?.balance || 0}
          </Link>
        </Button>
        <Button variant='outline' className='w-full'>
          <FaUserClock className='mr-2 size-4 text-primary' />
          {user?.onlinehours?.hour || 0}h : {user?.onlinehours?.minutes || 0}m :{' '}
          {user?.onlinehours?.seconds || 0}s
        </Button>
      </div>
    </div>
  );
}
