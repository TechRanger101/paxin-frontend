'use client';

import { TagSlider } from '@/components/common/tag-slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiSolidCategory } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { IoMdArchive } from 'react-icons/io';
import { LuArchiveRestore } from 'react-icons/lu';
import { MdOutlineHouseSiding } from 'react-icons/md';
import { RiEditBoxFill } from 'react-icons/ri';
import { EditPostModal } from './edit-post-modal';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export interface PostCardProps {
  id: number;
  title: string;
  original_title: string;
  subtitle: string;
  original_subtitle: string;
  content: string;
  original_content: string;
  hashtags: string[];
  expireDate: string;
  cities: {
    id: number;
    name: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
  gallery: {
    ID: number;
    BlogID: number;
    files: {
      path: string;
    }[];
  };
  archived: boolean;
  price: string;
  link: string;
  onArchive: () => void;
  onDelete: () => void;
  mutate: () => void;
}

export function PostCard({
  id,
  title,
  original_title,
  subtitle,
  original_subtitle,
  content,
  original_content,
  hashtags,
  expireDate,
  cities,
  categories,
  gallery,
  archived,
  price,
  link,
  onArchive,
  onDelete,
  mutate,
}: PostCardProps) {
  const t = useTranslations('main');
  const [isExtendsLoading, setIsExtendsLoading] = useState<boolean>(false);
  const [extendsTime, setExtendsTime] = useState<string>('3');

  const handleExtendsTime = async () => {
    setIsExtendsLoading(true);

    try {
      const res = await fetch(
        `/api/flows/extend${archived ? '?isArchive=true' : ''}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, days: extendsTime, price: '0' }),
        }
      );

      if (!res.ok) {
        throw new Error(t('failed_extend_time'));
      }

      toast.success(t('success_extend_time'), {
        position: 'top-right',
      });

      mutate();
    } catch (error) {
      toast.error(t('failed_extend_time'), {
        position: 'top-right',
      });
    }

    setIsExtendsLoading(false);
  };

  function timeLeft(date: any) {
    const now = new Date();
    const expireDate = new Date(date);
    const diff = expireDate.getTime() - now.getTime();

    if (diff <= 0) {
        return 'Истекло';
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    function getPlural(n: number, one: string, few: string, many: string) {
        if (n % 10 === 1 && n % 100 !== 11) {
            return one;
        } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
            return few;
        } else {
            return many;
        }
    }

    if (years > 0) {
        return `Через ${years} ${getPlural(years, 'год', 'года', 'лет')}`;
    } else if (months > 0) {
        return `Через ${months} ${getPlural(months, 'месяц', 'месяца', 'месяцев')}`;
    } else if (days > 0) {
        return `Через ${days} ${getPlural(days, 'день', 'дня', 'дней')}`;
    } else if (hours > 0) {
        return `Через ${hours} ${getPlural(hours, 'час', 'часа', 'часов')}`;
    } else if (minutes > 0) {
        return `Через ${minutes} ${getPlural(minutes, 'минуту', 'минуты', 'минут')}`;
    } else {
        return `Через ${seconds} ${getPlural(seconds, 'секунду', 'секунды', 'секунд')}`;
    }
  }

  return (
    <div className='mb-4 shadow-md p-3'>
      <div className='relative flex w-full flex-col gap-4 md:h-full md:flex-row'>
        <div
          aria-label='actions'
          className='absolute right-2 top-60 z-10 flex gap-2 md:top-0'
        >
          <EditPostModal
            blog={{
              id: id,
              title: original_title,
              content: original_content,
              subtitle: original_subtitle,
              hashtags: hashtags,
              cities: cities,
              categories: categories,
              gallery: gallery,
              price: price,
            }}
            mutate={mutate}
          >
            <Button variant='outline' size='icon' className='rounded-full'>
              <RiEditBoxFill className='size-4' />
            </Button>
          </EditPostModal>
          {archived ? (
            <Popover>
              <PopoverTrigger>
                <Button variant='outline' size='icon' className='rounded-full'>
                  <LuArchiveRestore className='size-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='flex items-center gap-2'>
                <Select value={extendsTime} onValueChange={setExtendsTime}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('number_of_days')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='3'>3 {t('days')}</SelectItem>
                      <SelectItem value='5'>5 {t('days')}</SelectItem>
                      <SelectItem value='10'>10 {t('days')}</SelectItem>
                      <SelectItem value='15'>15 {t('days')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={handleExtendsTime} disabled={isExtendsLoading}>
                  {isExtendsLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('extend')}
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant='outline'
              size='icon'
              className='rounded-full'
              onClick={onArchive}
            >
              <IoMdArchive className='size-4' />
            </Button>
          )}
          <Button
            variant='outline'
            size='icon'
            className='rounded-full'
            onClick={onDelete}
          >
            <FaTrashAlt className='size-4' />
          </Button>
        </div>
        <Carousel className='w-full md:w-52'>
          <CarouselContent>
            {gallery &&
              gallery.files &&
              gallery.files.map((image, index) => (
                <CarouselItem key={index}>
                  <div className='relative h-72 w-full'>
                    <Image
                      src={`https://proxy.paxintrade.com/400/https://img.paxintrade.com/${image.path}`}
                      alt='preview image'
                      style={{ objectFit: 'cover' }}
                      fill
                    />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className='left-3' />
          <CarouselNext className='right-3' />
        </Carousel>
        <div className='relative flex w-full flex-col md:h-72'>
          <Link href={link} className='line-clamp-2 max-w-screen-lg text-3xl font-bold'>
            {title}
          </Link>
          <div className='line-clamp-1 w-full text-sm text-muted-foreground md:w-[90%]'>
            {subtitle}
          </div>
          <div className='my-2 w-full max-w-full sm:max-w-xl'>
            <TagSlider tags={hashtags} mode='flow' />
          </div>
          <div
            className='line-clamp-3 w-full text-sm text-muted-foreground md:w-[90%]'
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <div className='my-2 flex items-center gap-3 text-sm'>
            <div>
              {t('expire_at')}: {timeLeft(expireDate)}
            </div>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant='outline'
                  className='h-auto border-red-500 px-2 py-1 text-red-500'
                  size='sm'
                >
                  {t('extend_time')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='flex items-center gap-2'>
                <Select value={extendsTime} onValueChange={setExtendsTime}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('number_of_days')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='3'>3 {t('days')}</SelectItem>
                      <SelectItem value='5'>5 {t('days')}</SelectItem>
                      <SelectItem value='10'>10 {t('days')}</SelectItem>
                      <SelectItem value='15'>15 {t('days')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={handleExtendsTime} disabled={isExtendsLoading}>
                  {isExtendsLoading && (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  )}
                  {t('extend')}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <div className='mt-auto flex flex-wrap gap-2'>
            {cities.map((city) => (
              <Badge
                variant='outline'
                className='rounded-full border-primary bg-primary/10 text-xs text-primary'
                key={city.id}
              >
                <MdOutlineHouseSiding className='mr-1 size-4' />
                {city.name}
              </Badge>
            ))}

            {categories.map((category) => (
              <Badge
                variant='outline'
                className='rounded-full border-primary bg-primary/10 text-primary text-xs'
                key={category.id}
              >
                <BiSolidCategory className='mr-1 size-4' />
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {/* <Separator className='my-4' /> */}
    </div>
  );
}
