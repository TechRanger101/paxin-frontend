'use client';

import { useEffect, useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { MdOutlinePostAdd } from 'react-icons/md';
import { RiArticleLine } from 'react-icons/ri';
import { MdOutlineSpeakerNotesOff } from 'react-icons/md';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { NewPostModal } from '@/components/profiles/posts/new-post-modal';
import { PostCard, PostCardProps } from '@/components/profiles/posts/post-card';
import { PostCardSkeleton } from '@/components/profiles/posts/post-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { PaginationComponent } from '@/components/common/pagination';
import { StreamingCreateModal } from '@/components/chat/streamingCreateModal';
import { CiStreamOn } from 'react-icons/ci';
import { PaxContext } from '@/context/context'; // Подключаем контекст
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Функция для получения данных с API
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const pageSize = 10;

export default function MyPostsPage() {
  const { user } = useContext(PaxContext);
  const locale = useLocale();
  const t = useTranslations('main');
  const tt = useTranslations('stream');

  const searchParams = useSearchParams();
  const router = useRouter();
  const [maxPage, setMaxPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [isArchiveLoading, setIsArchiveLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteID, setDeleteID] = useState<number>(-1);
  const [archiveID, setArchiveID] = useState<number>(-1);
  const [blogs, setBlogs] = useState<PostCardProps[]>([]);
  const [fetchURL, setFetchURL] = useState<string>('/api/flows/me');
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false); // Модальное окно для конвертации
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Состояние для отслеживания загрузки

  const {
    data: fetchedData,
    error,
    mutate: blogsMutate,
  } = useSWR(fetchURL, fetcher);

  useEffect(() => {
    const generateFetchURL = () => {
      const currentPage = searchParams.get('page')
        ? Number(searchParams.get('page'))
        : 1;
      let baseURL = `/api/flows/me?language=${locale}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;
      const queryParams = ['skip', 'limit', 'search', 'isArchive'];

      queryParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          baseURL += `&${param}=${value}`;
        }
      });

      return baseURL;
    };

    setFetchURL(generateFetchURL());
  }, [searchParams, locale]);

  useEffect(() => {
    if (!error && fetchedData) {
      setBlogs(fetchedData.data);
      setMaxPage(Math.ceil(fetchedData.meta.total / pageSize));
    }
  }, [fetchedData, error]);

  useEffect(() => {
    // Эмулируем задержку для демонстрации скелетона
    const timer = setTimeout(() => {
      setIsLoadingUser(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async () => {
    setIsDeleteLoading(true);

    try {
      const res = await fetch(`/api/flows/delete/${deleteID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteID }),
      });

      if (!res.ok) {
        throw new Error(t('failed_delete_post'));
      }

      toast.success(t('success_delete_post'), {
        position: 'top-right',
      });

      blogsMutate();
    } catch (error) {
      toast.error(t('failed_delete_post'), {
        position: 'top-right',
      });
    }

    setIsDeleteLoading(false);
    setShowDeleteModal(false);
  };

  const handleArchive = async () => {
    setIsArchiveLoading(true);

    try {
      const res = await fetch(`/api/flows/archive/${archiveID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: archiveID }),
      });

      if (!res.ok) {
        throw new Error(t('failed_archive_post'));
      }

      toast.success(t('success_archive_post'), {
        position: 'top-right',
      });

      blogsMutate();
    } catch (error) {
      toast.error(t('failed_archive_post'), {
        position: 'top-right',
      });
    }

    setIsArchiveLoading(false);
    setShowArchiveModal(false);
  };

  // Открытие модального окна для конвертации аккаунта в продавца
  const openConversionModal = () => {
    setIsConversionModalOpen(true);
  };

  const closeConversionModal = () => {
    setIsConversionModalOpen(false);
  };

  const handleConvertToSeller = async () => {
    // Логика отправки запроса на конвертацию аккаунта
    try {
      const response = await fetch('/api/convert-to-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (response.ok) {
        toast.success('Запрос на конвертацию отправлен!');
        closeConversionModal();
      } else {
        toast.error('Ошибка при отправке запроса');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса', error);
      toast.error('Ошибка при отправке запроса');
    }
  };

  if (isLoadingUser) {
    // Пока загружается пользовательская информация, показываем скелетон
    return (
      <div className='container mx-auto py-6'>
        <CustomSkeleton />
        <CustomSkeleton />
        <CustomSkeleton />
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6'>
      {user?.seller ? (
        <div className='mb-[0px] w-full px-0 pb-4 md:mb-[0px]'>
          <div className='px-0 py-4'>
            <StreamingCreateModal onCreate={() => {}} isLoading={false}>
              <Button className='btn btn--wide !m-0 flex w-full !rounded-md text-primary text-white'>
                <CiStreamOn className='mr-2 mt-0' size={20} />
                {tt('start_stream')}
              </Button>
            </StreamingCreateModal>
          </div>
          <div className='mb-4 flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
            <div className='relative w-full sm:w-80'>
              <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
              <Input
                type='text'
                placeholder={t('search')}
                className='pl-12 pr-4'
              />
            </div>
            <div className='flex w-full items-center justify-between gap-1 sm:w-auto'>
              <div className='grid h-9 grid-cols-2 gap-2 rounded-lg bg-background p-1 px-2'>
                <Button
                  className='h-7 bg-background text-xs text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                  data-state={
                    searchParams.get('isArchive') === 'true' ? '' : 'active'
                  }
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams);

                    if (searchParams.get('isArchive') === 'true') {
                      newSearchParams.delete('isArchive');
                      newSearchParams.set('page', '1');
                      router.push(`?${newSearchParams.toString()}`);
                    }
                  }}
                >
                  {t('all')}
                </Button>
                <Button
                  className='h-7 bg-background text-xs text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                  data-state={
                    searchParams.get('isArchive') === 'true' ? 'active' : ''
                  }
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (!searchParams.get('isArchive')) {
                      newSearchParams.set('isArchive', 'true');
                      newSearchParams.set('page', '1');
                      router.push(`?${newSearchParams.toString()}`);
                    }
                  }}
                >
                  {t('archive')}
                </Button>
              </div>
              <NewPostModal mutate={blogsMutate}>
                <Button className='btn btn--wide !m-0 !rounded-md'>
                  <MdOutlinePostAdd className='mr-2 size-5' />
                  {t('new_post')}
                </Button>
              </NewPostModal>
            </div>
          </div>

          {/* Основной контент */}
          {!error ? (
            fetchedData && blogs ? (
              blogs?.length > 0 ? (
                <div className='w-full rounded-md p-0'>
                  {blogs.map((blog) => (
                    <PostCard
                      key={blog.id}
                      id={blog.id}
                      title={blog.title}
                      original_title={blog.original_title}
                      subtitle={blog.subtitle}
                      original_subtitle={blog.original_subtitle}
                      content={blog.content}
                      original_content={blog.original_content}
                      hashtags={blog.hashtags}
                      expireDate={blog.expireDate}
                      cities={blog.cities}
                      categories={blog.categories}
                      gallery={blog.gallery}
                      archived={blog.archived}
                      price={blog.price}
                      link={blog.link}
                      onArchive={() => {
                        setArchiveID(blog.id);
                        setShowArchiveModal(true);
                      }}
                      onDelete={() => {
                        setDeleteID(blog.id);
                        setShowDeleteModal(true);
                      }}
                      mutate={blogsMutate}
                    />
                  ))}
                  {maxPage > 1 && (
                    <PaginationComponent
                      currentPage={
                        searchParams.get('page')
                          ? Number(searchParams.get('page'))
                          : 1
                      }
                      maxPage={maxPage}
                      gotoPage={(page) => {
                        const newSearchParams = new URLSearchParams(
                          searchParams
                        );
                        newSearchParams.set('page', page.toString());
                        router.push(`?${newSearchParams.toString()}`);
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className='flex h-60 w-full items-center justify-center rounded-md bg-background/30 p-8'>
                  <div className='flex flex-col items-center text-gray-400'>
                    <MdOutlineSpeakerNotesOff className='size-20' />
                    {t('no_blogs_yet')}
                  </div>
                </div>
              )
            ) : (
              <PostCardSkeleton />
            )
          ) : (
            <div></div>
          )}

          {/* Модальные окна */}
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title={t('are_you_sure')}
            description={t('are_you_sure_delete_post')}
            onConfirm={() => {
              handleDelete();
            }}
            loading={isDeleteLoading}
          />
          <ConfirmModal
            isOpen={showArchiveModal}
            onClose={() => setShowArchiveModal(false)}
            title={t('are_you_sure')}
            description={t('are_you_sure_archive_post')}
            onConfirm={() => {
              handleArchive();
            }}
            loading={isArchiveLoading}
          />
        </div>
      ) : (
        <div className='text-center'>
          <h2 className='text-xl font-bold'>
            Ваш аккаунт не является продавцом.
          </h2>
          <Button onClick={openConversionModal} className='mt-4'>
            Конвертировать аккаунт в продавца
          </Button>

          {/* Модальное окно для конвертации аккаунта */}
          <Dialog
            open={isConversionModalOpen}
            onOpenChange={closeConversionModal}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Конвертация аккаунта</DialogTitle>
                <DialogDescription>
                  Хотите конвертировать ваш аккаунт в аккаунт продавца? Это
                  позволит вам продавать товары и услуги на платформе.
                </DialogDescription>
              </DialogHeader>
              <div className='mt-4 flex justify-end'>
                <Button
                  onClick={handleConvertToSeller}
                  className='bg-blue-500 text-white'
                >
                  Подтвердить
                </Button>
                <Button onClick={closeConversionModal} variant='secondary'>
                  Отмена
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export function CustomSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-6 w-full animate-pulse rounded-md bg-gray-300'></div>
      <div className='h-6 w-3/4 animate-pulse rounded-md bg-gray-300'></div>
      <div className='h-6 w-1/2 animate-pulse rounded-md bg-gray-300'></div>
      <div className='h-6 w-full animate-pulse rounded-md bg-gray-300'></div>
    </div>
  );
}
