import { Blog } from '@/types/Blog';
import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';
import { PriceBadge } from '@/components/home/flow/price-badge';
import { CategoryBadge } from '@/components/home/flow/category-badge';
import { LocationBadge } from '@/components/home/flow/location-badge';
import { TagSlider } from '@/components/common/tag-slider';

interface BlogCardProps {
  blog: Blog;
}

const saveScrollPosition = () => {
  if (window === undefined) return;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(
      'home-page-scroll-position',
      (window.scrollY || document.documentElement.scrollTop).toString()
    );
  }
};

const BlogCard = ({ blog }: BlogCardProps) => {
  const heroImage = blog.photos?.[0]?.files?.[0]?.path
    ? `https://img.paxintrade.com/${blog.photos[0].files[0].path}`
    : '/default-hero.jpg'; // Фон по умолчанию, если нет изображения

  const location = blog.City?.[0]?.Translations?.[0]?.Name || 'Не указано';
  const category =
    blog.Catygory?.[0]?.Translations?.[0]?.Name || 'Без категории';
  const tags = blog.Hashtags?.map((tag) => tag.Hashtag) || [];

  return (
    <Card className='w-full overflow-hidden rounded-lg md:w-[400px]'>
      <CardContent className='relative p-0'>
        <Link
          key={`title-link-${blog.id}`}
          href='/flows/[id]/[slug]'
          as={`/flows/${blog.UniqId}/${blog.Slug}`}
          onClick={saveScrollPosition}
        >
          <div className='relative'>
            <div className='relative h-72 w-full'>
              <Image
                src={heroImage}
                alt={blog.Title}
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-t-lg'
              />
            </div>
            <div className='absolute right-4 top-4 flex space-x-2'>
              <Badge
                variant='default'
                className='bg-gradient-to-r from-[#00b887] to-[#01b6d3]  p-2 text-white'
              >
                Коммерческое предложение
              </Badge>
            </div>
            <div className='absolute inset-0 flex items-center justify-center rounded-t-md bg-gradient-to-b from-transparent via-transparent to-white dark:to-black'></div>
            <div className='absolute bottom-2 z-10 px-4'>
              <h2 className='text-xl font-semibold'>{blog.Title}</h2>
              <p className='text-gray-600 dark:text-gray-400'>{blog.Descr}</p>
            </div>
          </div>

          <div className='p-4'>
            <div className='mt-4'>
              <TagSlider tags={tags} />

              <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                <div className='flex min-w-[calc(50%-0.75rem)] flex-1'>
                  <PriceBadge>
                    {blog.Total.toLocaleString('ru-RU')} ₽
                  </PriceBadge>
                </div>
                <div className='flex min-w-[calc(50%-0.75rem)] flex-1'>
                  <LocationBadge>{location}</LocationBadge>
                </div>
                <CategoryBadge>{category}</CategoryBadge>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
