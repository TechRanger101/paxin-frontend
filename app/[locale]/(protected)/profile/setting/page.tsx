'use client';

import AvatarUploader from '@/components/AvatarUploader';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { ImageUpload, PreviewImage } from '@/components/common/file-uploader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PaxContext } from '@/context/context';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaTelegram } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { RiUserSettingsFill } from 'react-icons/ri';
import { RxCopy } from 'react-icons/rx';
import 'react-quill/dist/quill.snow.css';
import Select, { components, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWR, { mutate } from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import Cropper from 'react-easy-crop';
import * as z from 'zod';
import { SubscriptionCard } from '@/components/profiles/setting/subscription-card';
import { NewPostModal } from '@/components/profiles/setting/request4new';
import { NewPhoto } from '@/components/profiles/setting/newPhoto';

import { formatDateNew, formatAmount, getStatusTranslation } from '@/lib/utils';
import { GrHostMaintenance } from 'react-icons/gr';
import { IoMdPhotos } from 'react-icons/io';
import { MdDashboardCustomize } from 'react-icons/md';
import { useTheme } from 'next-themes';
import CustomControl from '@/components/utils/customControl';
import { SelectProvider } from '@/components/utils/selectContext';
import Loader from '@/components/ui/loader';
import { IoIosCloseCircleOutline, IoMdAdd } from 'react-icons/io';
import { Loader2 } from 'lucide-react';
import { ChangeNamePopup } from '@/components/profiles/dashboard/change-name-popup';
import Image from 'next/image';
import {
  MdAccountBalanceWallet,
  MdOutlineDriveFileRenameOutline,
} from 'react-icons/md';
import { MdDashboard, MdSettings, MdPostAdd } from 'react-icons/md';
import { IconType } from 'react-icons';
import { GiVideoConference } from 'react-icons/gi';
import { IoIosNotifications } from 'react-icons/io';
import CTASection from '@/components/profiles/cta';

const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const customStyles = (theme: string): StylesConfig<Option, true> => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  }),
  input: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#ffffff' : '#000000',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#333333' : '#ffffff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? theme === 'dark'
        ? '#555555'
        : '#eaeaea'
      : theme === 'dark'
        ? '#333333'
        : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    cursor: 'pointer',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#555555' : '#eaeaea',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#ffffff' : '#000000',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#ffffff' : '#000000',
    ':hover': {
      backgroundColor: theme === 'dark' ? '#777777' : '#cccccc',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
  }),
});

interface Profile {
  bio: string;
  hashtags: string[];
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
    ProfileID: number;
    files: {
      path: string;
    }[];
  } | null;
  telegram: {
    activated: boolean;
    token: string;
  };
  additionalinfo: string;
}

interface Option {
  value: string | number;
  label: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const basicFormSchema = z.object({
  city: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Выберите 1 из городов'),
  category: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Выберите 1 из категорий'),
  hashtags: z
    .array(
      z.object({
        value: z.union([z.string(), z.number()]),
        label: z.string(),
      })
    )
    .min(1, 'Выберите 1 из хэштегов'),
  bio: z.string().min(1, 'Заполните краткое описание профиля'),
});

type BasicFormData = z.infer<typeof basicFormSchema>;

type ImageUploadComponentType = {
  handleUpload: () => Promise<{ files: any[] } | null>;
  handleReset: () => void;
};

type GalleryType = {
  ID: number;
  ProfileID: number;
  files: { path: string }[];
};

const subscriptions = [
  {
    id: 0,
    title: 'Basic',
    price: {
      monthly: 9.99,
      annually: 99.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to standard workouts and nutrition plans',
      'Email support',
    ],
  },
  {
    id: 1,
    title: 'Pro',
    price: {
      monthly: 19.99,
      annually: 199.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to advanced workouts and nutrition plans',
      'Priority Email support',
      'Exclusive access to live Q&A sessions',
    ],
  },
  {
    id: 2,
    title: 'Ultimate',
    price: {
      monthly: 29.99,
      annually: 299.99,
    },
    description:
      'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    features: [
      'Access to all premium workouts and nutrition plans',
      '24/7 Priority support',
      '1-on-1 virtual coaching session every month',
      'Exclusive content and early access to new features',
    ],
  },
];

export default function SettingPage() {
  const { theme } = useTheme();
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mobileSelectType, setMobileSelectType] = useState<string | null>(null);
  const handleOpenMobileModal = (type: string) => {
    console.log(type);
    setMobileSelectType(type);
    setIsMobileModalOpen(true);
  };

  const t = useTranslations('main');
  const { user, userMutate } = useContext(PaxContext);

  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [openModalPhoto, setOpenModalPhoto] = useState(false);

  const [currentTab, setCurrentTab] = useState<string>('profile');

  const imageUploadRef = useRef<ImageUploadComponentType>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [gallery, setGallery] = useState<GalleryType>({} as GalleryType);
  const [rechargecode, setRechargecode] = useState<string>('');
  const [requestType, setRequestType] = useState('');

  const [isBasicLoading, setIsBasicLoading] = useState<boolean>(false);
  const [isDeleteAccountLoading, setIsDeleteAccountLoading] =
    useState<boolean>(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [upgradeLevel, setUpgradeLevel] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState<boolean>(false);
  const [isRechargeLoading, setIsRechargeLoading] = useState<boolean>(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const [isNeededUpdate, setIsNeededUpdate] = useState<boolean>(false);

  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>();
  const [hashtagOptions, setHashtagOptions] = useState<Option[]>([]);
  const [cityKeyword, setCityKeyword] = useState<string>('');
  const [categoryKeyword, setCategoryKeyword] = useState<string>('');

  const [searchResults, setSearchResults] = useState<Option[]>([]);
  const [searchResultsCategory, setSearchResultsCategory] = useState<Option[]>(
    []
  );

  const [isHashtagLoading, setIsHashtagLoading] = useState(false);
  const [searchResultsHashtag, setSearchResultsHashtag] = useState<Option[]>(
    []
  );
  const [hashtagKeyword, setHashtagKeyword] = useState<string>('');
  const [hashtagURL, setHashtagURL] = useState<string>(
    `/api/hashtags/profile/get`
  );

  const [isLoading, setIsLoading] = useState(false);

  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
  });

  const {
    data: fetchedData,
    error,
    mutate: profileMutate,
  } = useSWR(`/api/profiles/me?language=${locale}`, fetcher);

  const { data: fetchedCities, error: cityFetchError } = useSWR(
    cityKeyword
      ? `/api/cities/query?name=${cityKeyword}&lang=${locale}`
      : `/api/cities/get?lang=${locale}`,
    fetcher
  );
  const { data: fetchedCategories, error: categoryFetchError } = useSWR(
    categoryKeyword
      ? `/api/categories/query?name=${categoryKeyword}&lang=${locale}`
      : `/api/categories/get?lang=${locale}&limit=100`,
    fetcher
  );

  // if (!fetchedTransaction && !transactionFetchError) return <div>Loading...</div>;

  // if (transactionFetchError) return <div>Error loading</div>;

  const { data: fetchedHashtags, error: hashtagFetchError } = useSWR(
    hashtagURL,
    fetcher
  );

  const handleCitySearch = useDebouncedCallback((value: string) => {
    setCityKeyword(value);
    setIsLoading(true);
  }, 300);

  const handleCategorySearch = useDebouncedCallback((value: string) => {
    setCategoryKeyword(value);
    setIsCategoryLoading(true);
  }, 300);

  const handleImageUpload = (newAvatarPath: string) => {
    alert(newAvatarPath);
    // Логика после успешной загрузки аватара (например, обновление состояния профиля)
  };

  function customFilterFunction(option: Option, searchInput: string) {
    return true;
  }

  useEffect(() => {
    setCurrentTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  useEffect(() => {
    if (!error && fetchedData) {
      setProfile(fetchedData);
      setGallery(fetchedData.gallery);
      setAdditionalInfo(fetchedData.additionalinfo);

      basicForm.setValue(
        'city',
        fetchedData.cities.map((city: any) => ({
          value: city.id,
          label: city.name,
        }))
      );

      basicForm.setValue(
        'category',
        fetchedData.categories.map((category: any) => ({
          value: category.id,
          label: category.name,
        }))
      );

      basicForm.setValue(
        'hashtags',
        fetchedData.hashtags.map((hashtag: any) => ({
          value: hashtag.id,
          label: hashtag.name,
        }))
      );

      basicForm.setValue('bio', fetchedData.bio);
    }
  }, [fetchedData, error]);

  useEffect(() => {
    if (fetchedCities) {
      if (fetchedCities.data.length == 0) {
        setIsLoading(false);
        setSearchResults([
          {
            value: -1,
            label: t('no_city'),
          },
        ]);

        setCityOptions([
          {
            value: -1,
            label: t('no_city'),
          },
        ]);
      } else {
        const limitedResults = fetchedCities.data
          .map((city: any) => ({
            value: city.ID,
            label: city.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
          .slice(0, 3); // Ограничение до 3 элементов

        setSearchResults(limitedResults);
        setIsLoading(false);
        setCityOptions(
          fetchedCities.data.map((city: any) => ({
            value: city.ID,
            label: city.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
        );
      }
    }
  }, [fetchedCities]);

  useEffect(() => {
    if (fetchedCategories) {
      if (fetchedCategories.data.length == 0) {
        setIsCategoryLoading(false);
        setSearchResultsCategory([
          {
            value: -1,
            label: t('no_category'),
          },
        ]);

        setCategoryOptions([
          {
            value: -1,
            label: t('no_category'),
          },
        ]);
      } else {
        const limitedResults = fetchedCategories.data
          .map((category: any) => ({
            value: category.ID,
            label: category.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
          .slice(0, 3); // Ограничение до 3 элементов

        setSearchResultsCategory(limitedResults);
        setIsCategoryLoading(false);
        setCategoryOptions(
          fetchedCategories.data.map((category: any) => ({
            value: category.ID,
            label: category.Translations.find((t: any) => t.Language === locale)
              .Name,
          }))
        );
      }
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (!hashtagFetchError && fetchedHashtags) {
      if (fetchedHashtags.length === 0 && hashtagKeyword) {
        setIsHashtagLoading(false);
        setSearchResultsHashtag([
          {
            value: hashtagKeyword,
            label: hashtagKeyword,
          },
        ]);
        setHashtagOptions([
          {
            value: hashtagKeyword,
            label: hashtagKeyword,
          },
        ]);
      } else {
        const limitedResults = fetchedHashtags
          .map((hashtag: any) => ({
            value: hashtag.ID,
            label: hashtag.Hashtag,
          }))
          .slice(0, 3); // Ограничение до 3 элементов
        setIsHashtagLoading(false);
        setSearchResultsHashtag(limitedResults);
        setHashtagOptions(
          fetchedHashtags.map((hashtag: any) => ({
            value: hashtag.ID,
            label: hashtag.Hashtag,
          }))
        );
      }
    } else {
      setHashtagOptions([]);
      setSearchResultsHashtag([]);
    }
  }, [hashtagFetchError, fetchedHashtags, hashtagKeyword]);

  const handleLinkCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ align: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'code-block',
  ];

  const submitAddtionalInfo = async () => {
    setIsAdditionalLoading(true);

    try {
      const res = await axios.patch(
        '/api/profiles/patch',
        { additionalinfo: additionalInfo },
        {
          headers: {
            additional: true,
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('profile_updated_successfully'), {
          position: 'top-right',
        });
        profileMutate();
      } else {
        toast.error(t('profile_update_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('profile_update_failed'), {
        position: 'top-right',
      });
    }

    setIsAdditionalLoading(false);
  };

  const submitBasicInfo = async (data: BasicFormData) => {
    setIsBasicLoading(true);

    for (const hashtag of data.hashtags) {
      if (hashtag.label === hashtag.value) {
        try {
          const res = await axios.post('/api/hashtags/create', {
            hashTag: hashtag.label,
          });

          if (res.status === 200) {
            const hashtagData = res.data.data;

            hashtag.value = hashtagData.ID;
          } else {
            toast.error(t('add_hashtag_failed'), {
              position: 'top-right',
            });

            setIsBasicLoading(false);

            return;
          }
        } catch (error) {
          toast.error(t('add_hashtag_failed'), {
            position: 'top-right',
          });

          setIsBasicLoading(false);

          return;
        }
      }
    }

    try {
      const res = await axios.patch('/api/profiles/patch', {
        city: data.city.map((city: any) => ({
          ID: city.value,
          Name: city.label,
        })),
        guilds: data.category.map((category: any) => ({
          ID: category.value,
          Name: category.label,
        })),
        hashtags: data.hashtags.map((hashtag: any) => ({
          ID: hashtag.value,
          Hashtag: hashtag.label,
        })),
        bio: data.bio,
      });

      if (res.status === 200) {
        toast.success(t('success_profile_update'), {
          position: 'top-right',
        });
        profileMutate();
        userMutate();
      } else {
        toast.error(t('failed_profile_update'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('failed_profile_update'), {
        position: 'top-right',
      });
    }

    setIsBasicLoading(false);
  };

  const submitGallery = async () => {
    setIsGalleryLoading(true);

    try {
      const files = await imageUploadRef.current?.handleUpload();

      const res = await axios.patch(
        `/api/profiles/patch`,
        {
          uploadedGallery:
            files?.files && files?.files?.length > 0
              ? files?.files.map((file: any) => ({
                  path: file?.path,
                }))
              : false,
          gallery: isNeededUpdate ? gallery : false,
        },
        {
          headers: {
            gallery: true,
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('gallery_updated_successfully'), {
          position: 'top-right',
        });

        imageUploadRef.current?.handleReset();
        profileMutate();
      } else {
        toast.error(t('gallery_update_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('gallery_update_failed'), {
        position: 'top-right',
      });
    }

    setIsGalleryLoading(false);
  };

  const submitBankRecharge = async () => {
    setOpenBankModal(true);
  };

  useEffect(() => {
    if (openBankModal === false) {
      mutate(`/api/profiles/balance/get`);
    }
  }, [openBankModal]);

  const submitRechargecode = async () => {
    setIsRechargeLoading(true);

    try {
      const res = await axios.post('/api/profiles/balance/add', {
        code: rechargecode,
      });

      if (res.status === 200) {
        toast.success(t('recharge_successfully'), {
          position: 'top-right',
        });
        setRechargecode('');
      } else {
        toast.error(t('recharge_failed'), {
          position: 'top-right',
        });
      }

      //balanceMutate();
    } catch (error) {
      toast.error(t('recharge_failed'), {
        position: 'top-right',
      });
    }

    setIsRechargeLoading(false);
  };

  const removeGallery = (path: string) => {
    if (gallery.files.length === 1) {
      toast.error(t('you_must_have_at_least_one_image'), {
        position: 'top-right',
      });

      return;
    }
    const _gallery = {
      ID: gallery.ID,
      ProfileID: gallery.ProfileID,
      files: [],
    } as GalleryType;

    _gallery.files = gallery.files.filter((file: any) => file.path !== path);

    setGallery(_gallery);
    setIsNeededUpdate(true);
  };

  const handleHashtagSearch = useDebouncedCallback((query: string) => {
    if (query) {
      setHashtagURL(`/api/hashtags/get?name=${query}`);
    } else {
      setHashtagURL(`/api/hashtags/profile/get`);
    }
    setIsHashtagLoading(true);
  }, 300);

  const handleDeleteAccount = async () => {
    setIsDeleteAccountLoading(true);

    try {
      const res = await axios.post('/api/users/me/delete');

      if (res.status === 200) {
        toast.success('Account deleted successfully', {
          position: 'top-right',
        });

        signOut({ callbackUrl: '/' });
      } else {
        toast.error('Failed to delete account', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to delete account', {
        position: 'top-right',
      });
    }

    setIsDeleteAccountLoading(false);
  };

  const handleUpgradeSubscription = async () => {
    setIsUpgradeLoading(true);

    try {
      const res = await axios.post('/api/users/me/subscription', {
        level: upgradeLevel,
      });

      if (res.status === 200) {
        toast.success('Subscription upgraded successfully', {
          position: 'top-right',
        });

        setShowUpgradeModal(false);
      } else {
        toast.error('Failed to upgrade subscription', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Failed to upgrade subscription', {
        position: 'top-right',
      });
    } finally {
      setIsUpgradeLoading(false);
    }
  };

  type ProfileConfig = {
    [key: string]: {
      icon: IconType;
      titleKey: string;
      descriptionKey: string;
    };
  };

  const profileConfig: ProfileConfig = {
    '/profile/posts': {
      icon: MdPostAdd,
      titleKey: 'my_posts',
      descriptionKey: 'my_posts_description',
    },
    '/profile/setting': {
      icon: MdSettings,
      titleKey: 'settings',
      descriptionKey: 'setting_description',
    },
    '/profile': {
      icon: MdDashboard,
      titleKey: 'dashboard',
      descriptionKey: 'dashboard_description',
    },
    '/profile/conference': {
      icon: GiVideoConference,
      titleKey: 'conference',
      descriptionKey: 'conference_description',
    },
    '/profile/notifications': {
      icon: IoIosNotifications,
      titleKey: 'notifications',
      descriptionKey: 'conference_description',
    },
  };

  const getConfigForPath = (path: string) => {
    // Удаляем префикс локали из пути
    const pathWithoutLocale = path.replace(/^\/(ru|es|ka)/, '');

    return profileConfig[pathWithoutLocale] || profileConfig['/profile'];
  };

  const pathname = usePathname();
  const config = getConfigForPath(pathname);

  return (
    <div className='px-4 pb-4'>
      <div className='px-0 py-4'>
        <CTASection
          //@ts-ignore
          title={t(config.titleKey)}
          //@ts-ignore
          description={t(config.descriptionKey)}
          icon={config.icon}
        />
      </div>
      <div className='relative flex justify-between rounded-lg bg-white p-4 shadow-md dark:bg-black md:col-span-2'>
        <div>
          <div className='mt-0 w-full space-y-2'>
            {fetchedData?.streaming !== null && (
              <div className='mt-0 space-y-2 pb-4'>
                {fetchedData?.streaming?.length > 0 ? (
                  fetchedData?.streaming?.map((stream: any, index: number) => (
                    <Link
                      href={`/stream/${stream.RoomID}/host`}
                      className='flex items-center justify-center gap-2'
                    >
                      <div
                        key={index}
                        className='w-full rounded-lg bg-blue-500 p-4'
                      >
                        <div className='text-md'>
                          Ваш эфир создан: {stream.Title}
                        </div>
                        <div className='text-sm'>Отркыть</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className='text-sm text-muted-foreground'></div>
                )}
              </div>
            )}
          </div>
          <div className='flex cursor-pointer flex-col items-start text-2xl font-semibold'>
            <div className='flex flex-row items-center gap-2'>
              {t('hello')} {user?.username}{' '}
              <img
                onClick={() => setOpenModalPhoto(true)}
                className='h-20 w-20 rounded-full'
                src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${user?.avatar}`}
                alt='User Avatar'
              />
              <NewPhoto
                openModal={openModalPhoto}
                setOpenModal={setOpenModalPhoto}
                requestType={requestType}
              />
            </div>
            <ChangeNamePopup>
              <Button variant='link' size='icon' className='inline w-full'>
                <div className='flex gap-2'>
                  <div>Cменить имя</div>
                  <MdOutlineDriveFileRenameOutline className='text-2xl' />
                </div>
              </Button>
            </ChangeNamePopup>
          </div>
          {/* <div className='text-sm text-muted-foreground'>
        {t('view_all_alerts_description')}
      </div> */}
          <div className='relative mt-8 flex items-center gap-2'>
            {/* <Separator
          orientation='vertical'
          className='relative mx-2 h-14 w-[1px]'
        /> */}
            <div className='cursor-pointer space-y-4 text-center'>
              <Link
                href={`/profile/posts?callback=${encodeURIComponent('/profile/dashboard')}`}
                className='cursor-pointer space-y-4 text-center'
              >
                <div className='text-center text-sm text-muted-foreground'>
                  {t('publications')}
                </div>
                <div className='text-center text-3xl font-extrabold'>
                  {user?.totalposts || 0}
                </div>
              </Link>
            </div>
            <Separator
              orientation='vertical'
              className='relative mx-2 h-14 w-[1px]'
            />
            <Link
              href={`/profile/relationships?callback=${encodeURIComponent('/profile/dashboard')}`}
              className='cursor-pointer space-y-4 text-center'
            >
              <div className='text-center text-sm text-muted-foreground'>
                {t('followers')}
              </div>
              <div className='text-center text-3xl font-extrabold'>
                {user?.followers || 0}
              </div>
            </Link>
          </div>
        </div>
        <div className='hidden md:block'>
          <Image
            src={'/images/analytic.svg'}
            alt='analytic'
            width={196}
            height={147}
          />
        </div>
      </div>
      <NewPostModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        requestType={requestType}
      />
      {/* <Loader /> */}
      <Separator className='mb-4' />
      <div className='mb-[100px] w-full md:mb-[0px]'>
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t('are_you_sure')}
          description={t('are_you_sure_delete_account')}
          onConfirm={() => {
            handleDeleteAccount();
          }}
          loading={isDeleteAccountLoading}
        />
        <ConfirmModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title={t('are_you_sure')}
          description={t('are_you_sure_upgrade_subscription')}
          onConfirm={() => {
            handleUpgradeSubscription();
          }}
          loading={isUpgradeLoading}
        />
        <Tabs
          value={currentTab}
          className='w-full items-start bg-background py-2 sm:flex'
          orientation='vertical'
        >
          <TabsList className='flex h-auto w-full justify-center !overflow-hidden bg-background px-2 sm:w-60 sm:flex-col md:justify-start'>
            <TabsTrigger
              value='profile'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=profile'>
                <div className='flex flex-col items-center justify-center md:flex-row'>
                  <FaUser className='mr-2 size-4 min-w-4' />
                  <span>{t('profile_settings')}</span>
                </div>
              </Link>
            </TabsTrigger>
            {/* <TabsTrigger
              value='accounting'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=accounting'>
                <MdAccountBalanceWallet className='mr-2 size-4 min-w-4' />
                {t('accounting')}
              </Link>
            </TabsTrigger> */}
            <TabsTrigger
              value='telegram'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=telegram'>
                <div className='flex flex-col items-center justify-center md:flex-row'>
                  <FaTelegram className='mr-2 size-4 min-w-4' />
                  <span>{t('telegram')}</span>
                </div>
              </Link>
            </TabsTrigger>
            {/* <TabsTrigger
              value='subscription'
              className='text-md w-full p-3 !shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:justify-start'
              asChild
            >
              <Link href='/profile/setting?tab=subscription'>
                <GrUpdate className='mr-2 size-4 min-w-4' />
                {t('subscription')}
              </Link>
            </TabsTrigger> */}
          </TabsList>
          <div className='w-full'>
            <TabsContent className='my-2 w-full' value='profile'>
              <div className='px-3'>
                <div className='mb-3 text-center text-2xl font-semibold md:text-left'>
                  {/* {t('profile_settings')} */}
                </div>
                <Tabs defaultValue='basic' className='w-full'>
                  <TabsList className='flex w-auto justify-start !gap-6 !overflow-hidden bg-background'>
                    <TabsTrigger
                      value='basic'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background !pl-0 !pr-0 data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      <div className='flex items-center gap-1'>
                        <GrHostMaintenance size='12' /> {t('basic')}
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value='photo-gallery'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background !pl-0 !pr-0 data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      <div className='flex items-center gap-1'>
                        <IoMdPhotos size='12' /> {t('photo_gallery')}{' '}
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value='additional'
                      className='w-auto rounded-none border-b-2 border-transparent bg-background !pl-0 !pr-0 data-[state=active]:border-primary data-[state=active]:shadow-none'
                    >
                      <div className='flex items-center gap-1'>
                        <MdDashboardCustomize size='12' />
                        {t('additional')}{' '}
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value='basic'
                    className='flex w-full max-w-lg flex-col gap-3'
                  >
                    <Form {...basicForm}>
                      <form
                        onSubmit={basicForm.handleSubmit(submitBasicInfo)}
                        className='w-full space-y-2'
                      >
                        <FormField
                          control={basicForm.control}
                          name='city'
                          render={({ field }) => {
                            const removeCity = (cityToRemove: Option) => {
                              const updatedCities = field.value.filter(
                                (city: Option) =>
                                  city.value !== cityToRemove.value
                              );
                              basicForm.setValue('city', updatedCities);
                            };

                            const addCity = (city: Option) => {
                              if (city.value === -1) {
                                setRequestType('city');
                                setOpenModal(true);
                              } else if (
                                !field.value.some(
                                  (c: Option) => c.value === city.value
                                )
                              ) {
                                basicForm.setValue('city', [
                                  ...field.value,
                                  city,
                                ]);
                                setSearchResults((prevResults) =>
                                  prevResults.filter(
                                    (c: Option) => c.value !== city.value
                                  )
                                );
                              }
                            };

                            const handleModalClose = (isOpen: boolean) => {
                              setIsMobileModalOpen(isOpen);
                              if (!isOpen) {
                                basicForm.handleSubmit(submitBasicInfo)();
                              }
                            };

                            return (
                              <FormItem>
                                <FormLabel htmlFor='city'>
                                  {t('city_of_operation')}
                                </FormLabel>
                                <FormControl>
                                  <SelectProvider
                                    onOpenMobileModal={() =>
                                      handleOpenMobileModal('city')
                                    }
                                  >
                                    <Select
                                      isMulti
                                      options={cityOptions}
                                      value={field.value}
                                      components={{
                                        Control: (props) => (
                                          <CustomControl
                                            {...props}
                                            type='city'
                                          />
                                        ),
                                      }}
                                      onChange={(value) => {
                                        if (
                                          value.slice(-1)[0] &&
                                          value.slice(-1)[0].value === -1
                                        ) {
                                          setRequestType('city');
                                          setOpenModal(true);
                                        } else if (value) {
                                          basicForm.setValue('city', [
                                            ...value,
                                          ]);
                                        }
                                      }}
                                      onInputChange={(value) =>
                                        handleCitySearch(value)
                                      }
                                      filterOption={customFilterFunction}
                                      noOptionsMessage={() => t('no_options')}
                                      placeholder={t('select') + '...'}
                                      styles={customStyles(theme || 'light')}
                                      classNames={{
                                        input: () =>
                                          'dark:text-white text-black text-[16px]',
                                        control: () =>
                                          '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                        option: () =>
                                          '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                        menu: () => '!bg-muted',
                                        indicatorsContainer: () =>
                                          'invisible md:visible',
                                      }}
                                    />
                                  </SelectProvider>
                                </FormControl>
                                <FormMessage />
                                <Dialog
                                  open={
                                    isMobileModalOpen &&
                                    mobileSelectType === 'city'
                                  }
                                  onOpenChange={handleModalClose}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Выбор города(ов)
                                      </DialogTitle>
                                      <DialogClose />
                                    </DialogHeader>
                                    <div>
                                      {mobileSelectType === 'city' && (
                                        <div className='flex flex-wrap gap-2'>
                                          <Input
                                            placeholder='Найдите или выберите'
                                            onChange={(e) =>
                                              handleCitySearch(e.target.value)
                                            }
                                          />
                                          {isLoading ? (
                                            <Loader2 className='mr-2 size-4 animate-spin' />
                                          ) : (
                                            searchResults.length > 0 && (
                                              <div className='w-full rounded-md'>
                                                {searchResults.map((city) => (
                                                  <div
                                                    key={city.value}
                                                    className='mb-2 cursor-pointer rounded-sm bg-gray-200 p-2 text-black dark:bg-gray-800 dark:text-white'
                                                    onClick={() =>
                                                      addCity(city)
                                                    }
                                                  >
                                                    <div className='flex items-center justify-between gap-2'>
                                                      {city.label}
                                                      <IoMdAdd />
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )
                                          )}
                                          <Separator className='mb-4' />
                                          <span>Уже добавленные</span>
                                          <br />
                                          <div className='flex flex-wrap gap-2'>
                                            {field.value.map((city: Option) => (
                                              <div
                                                key={city.value}
                                                className='cursor-pointer bg-black p-2 text-white dark:bg-white dark:text-black'
                                                onClick={() => removeCity(city)}
                                              >
                                                <div className='flex items-center justify-center gap-2'>
                                                  {city.label}
                                                  <IoIosCloseCircleOutline />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleModalClose(false)}
                                      >
                                        {t('close')}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={basicForm.control}
                          name='category'
                          render={({ field }) => {
                            const removeCategory = (
                              categoryToRemove: Option
                            ) => {
                              const updatedCategories = field.value.filter(
                                (category: Option) =>
                                  category.value !== categoryToRemove.value
                              );
                              basicForm.setValue('category', updatedCategories);
                            };

                            const addCategory = (category: Option) => {
                              if (category.value === -1) {
                                setRequestType('category');
                                setOpenModal(true);
                              } else if (
                                !field.value.some(
                                  (c: Option) => c.value === category.value
                                )
                              ) {
                                basicForm.setValue('category', [
                                  ...field.value,
                                  category,
                                ]);
                                setSearchResultsCategory((prevResults) =>
                                  prevResults.filter(
                                    (c: Option) => c.value !== category.value
                                  )
                                );
                              }
                            };
                            const handleModalClose = (isOpen: boolean) => {
                              setIsMobileModalOpen(isOpen);
                              if (!isOpen) {
                                basicForm.handleSubmit(submitBasicInfo)();
                              }
                            };

                            return (
                              <FormItem>
                                <FormLabel htmlFor='category'>
                                  {t('type_of_activities')}
                                </FormLabel>
                                <FormControl>
                                  <SelectProvider
                                    onOpenMobileModal={() =>
                                      handleOpenMobileModal('category')
                                    }
                                  >
                                    <Select
                                      isMulti
                                      options={categoryOptions}
                                      value={field.value}
                                      components={{
                                        Control: (props) => (
                                          <CustomControl
                                            {...props}
                                            type='category'
                                          />
                                        ),
                                      }}
                                      onChange={(value) => {
                                        if (
                                          value.slice(-1)[0] &&
                                          value.slice(-1)[0].value === -1
                                        ) {
                                          setRequestType('category');
                                          setOpenModal(true);
                                        } else if (value) {
                                          basicForm.setValue('category', [
                                            ...value,
                                          ]);
                                        }
                                      }}
                                      onInputChange={(value) =>
                                        handleCategorySearch(value)
                                      }
                                      filterOption={customFilterFunction}
                                      noOptionsMessage={() => t('no_options')}
                                      placeholder={t('select') + '...'}
                                      styles={customStyles(theme || 'light')}
                                      classNames={{
                                        input: () =>
                                          'dark:text-white text-black text-[16px]',
                                        control: () =>
                                          '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                        option: () =>
                                          '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                        menu: () => '!bg-muted',
                                        indicatorsContainer: () =>
                                          'invisible md:visible',
                                      }}
                                    />
                                  </SelectProvider>
                                </FormControl>
                                <FormMessage />
                                <Dialog
                                  open={
                                    isMobileModalOpen &&
                                    mobileSelectType === 'category'
                                  }
                                  onOpenChange={handleModalClose}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Выбор категорий</DialogTitle>
                                      <DialogClose />
                                    </DialogHeader>
                                    <div>
                                      {mobileSelectType === 'category' && (
                                        <div className='flex flex-wrap gap-2'>
                                          <Input
                                            placeholder='Найдите или выберите'
                                            onChange={(e) =>
                                              handleCategorySearch(
                                                e.target.value
                                              )
                                            }
                                          />
                                          {isCategoryLoading ? (
                                            <Loader2 className='mr-2 size-4 animate-spin' />
                                          ) : (
                                            searchResultsCategory.length >
                                              0 && (
                                              <div className='w-full rounded-md'>
                                                {searchResultsCategory.map(
                                                  (category) => (
                                                    <div
                                                      key={category.value}
                                                      className='mb-2 cursor-pointer rounded-sm bg-gray-200 p-2 text-black dark:bg-gray-800 dark:text-white'
                                                      onClick={() =>
                                                        addCategory(category)
                                                      }
                                                    >
                                                      <div className='flex items-center justify-between gap-2'>
                                                        {category.label}
                                                        <IoMdAdd />
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )
                                          )}
                                          <Separator className='mb-4' />
                                          <span>Уже добавленные</span>
                                          <br />
                                          <div className='flex flex-wrap gap-2'>
                                            {field.value.map(
                                              (category: Option) => (
                                                <div
                                                  key={category.value}
                                                  className='cursor-pointer bg-black p-2 text-white dark:bg-white dark:text-black'
                                                  onClick={() =>
                                                    removeCategory(category)
                                                  }
                                                >
                                                  <div className='flex items-center justify-center gap-2'>
                                                    {category.label}
                                                    <IoIosCloseCircleOutline />
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleModalClose(false)}
                                      >
                                        {t('close')}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={basicForm.control}
                          name='hashtags'
                          render={({ field }) => {
                            const removeHashtag = (hashtagToRemove: Option) => {
                              const updatedHashtags = field.value.filter(
                                (hashtag: Option) =>
                                  hashtag.value !== hashtagToRemove.value
                              );
                              basicForm.setValue('hashtags', updatedHashtags);
                            };

                            const addHashtag = async (hashtag: Option) => {
                              if (hashtag.label === hashtag.value) {
                                try {
                                  const res = await axios.post(
                                    '/api/hashtags/create',
                                    {
                                      hashTag: hashtag.label,
                                    }
                                  );

                                  if (res.status === 200) {
                                    const hashtagData = res.data.data;
                                    hashtag.value = hashtagData.ID;
                                    if (
                                      !field.value.some(
                                        (h: Option) => h.value === hashtag.value
                                      )
                                    ) {
                                      basicForm.setValue('hashtags', [
                                        ...field.value,
                                        hashtag,
                                      ]);
                                      setSearchResultsHashtag((prevResults) =>
                                        prevResults.filter(
                                          (h: Option) =>
                                            h.value !== hashtag.value
                                        )
                                      );
                                    }
                                  } else {
                                    toast.error(t('add_hashtag_failed'), {
                                      position: 'top-right',
                                    });
                                  }
                                } catch (error) {
                                  toast.error(t('add_hashtag_failed'), {
                                    position: 'top-right',
                                  });
                                }
                              } else if (
                                !field.value.some(
                                  (h: Option) => h.value === hashtag.value
                                )
                              ) {
                                basicForm.setValue('hashtags', [
                                  ...field.value,
                                  hashtag,
                                ]);
                                setSearchResultsHashtag((prevResults) =>
                                  prevResults.filter(
                                    (h: Option) => h.value !== hashtag.value
                                  )
                                );
                              }
                            };

                            const handleModalClose = (isOpen: boolean) => {
                              setIsMobileModalOpen(isOpen);
                              if (!isOpen) {
                                basicForm.handleSubmit(submitBasicInfo)();
                              }
                            };

                            return (
                              <FormItem>
                                <FormLabel htmlFor='hashtags'>
                                  {t('hashtag_for_promoting')}
                                </FormLabel>
                                <FormControl>
                                  <SelectProvider
                                    onOpenMobileModal={() =>
                                      handleOpenMobileModal('hashtag')
                                    }
                                  >
                                    <CreatableSelect
                                      isMulti
                                      placeholder={t('select') + '...'}
                                      noOptionsMessage={() => t('no_options')}
                                      options={hashtagOptions}
                                      value={field.value}
                                      components={{
                                        Control: (props) => (
                                          <CustomControl
                                            {...props}
                                            type='hashtag'
                                          />
                                        ),
                                      }}
                                      onChange={(value) => {
                                        if (
                                          value.slice(-1)[0] &&
                                          value.slice(-1)[0].label ===
                                            value.slice(-1)[0].value
                                        ) {
                                          addHashtag(value.slice(-1)[0]);
                                        } else if (value) {
                                          basicForm.setValue('hashtags', [
                                            ...value,
                                          ]);
                                        }
                                      }}
                                      onInputChange={(value) => {
                                        setHashtagKeyword(value);
                                        handleHashtagSearch(value);
                                      }}
                                      filterOption={customFilterFunction}
                                      formatCreateLabel={(inputValue) =>
                                        `Добавить "${inputValue}"`
                                      }
                                      styles={customStyles(theme || 'light')}
                                      classNames={{
                                        input: () =>
                                          'dark:text-white text-black text-[16px]',
                                        control: () =>
                                          '!flex !w-full !rounded-md !border !border-input !bg-background !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50',
                                        option: () =>
                                          '!bg-transparent !my-0 hover:!bg-muted-foreground !cursor-pointer',
                                        menu: () => '!bg-muted',
                                        indicatorsContainer: () =>
                                          'invisible md:visible',
                                      }}
                                    />
                                  </SelectProvider>
                                </FormControl>
                                <FormMessage />
                                <Dialog
                                  open={
                                    isMobileModalOpen &&
                                    mobileSelectType === 'hashtag'
                                  }
                                  onOpenChange={handleModalClose}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Выбор хэштегов</DialogTitle>
                                      <DialogClose />
                                    </DialogHeader>
                                    <div>
                                      {mobileSelectType === 'hashtag' && (
                                        <div className='flex flex-wrap gap-2'>
                                          <Input
                                            placeholder='Найдите или выберите'
                                            onChange={(e) => {
                                              setHashtagKeyword(e.target.value);
                                              handleHashtagSearch(
                                                e.target.value
                                              );
                                            }}
                                          />
                                          {isHashtagLoading ? (
                                            <Loader2 className='mr-2 size-4 animate-spin' />
                                          ) : (
                                            searchResultsHashtag.length > 0 && (
                                              <div className='w-full rounded-md'>
                                                {searchResultsHashtag.map(
                                                  (hashtag) => (
                                                    <div
                                                      key={hashtag.value}
                                                      className='mb-2 cursor-pointer rounded-sm bg-gray-200 p-2 text-black dark:bg-gray-800 dark:text-white'
                                                      onClick={() =>
                                                        addHashtag(hashtag)
                                                      }
                                                    >
                                                      <div className='flex items-center justify-between gap-2'>
                                                        {hashtag.label}
                                                        <IoMdAdd />
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )
                                          )}
                                          <Separator className='mb-4' />
                                          <span>Уже добавленные</span>
                                          <br />
                                          <div className='flex flex-wrap gap-2'>
                                            {field.value.map(
                                              (hashtag: Option) => (
                                                <div
                                                  key={hashtag.value}
                                                  className='cursor-pointer bg-black p-2 text-white dark:bg-white dark:text-black'
                                                  onClick={() =>
                                                    removeHashtag(hashtag)
                                                  }
                                                >
                                                  <div className='flex items-center justify-center gap-2'>
                                                    {hashtag.label}
                                                    <IoIosCloseCircleOutline />
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleModalClose(false)}
                                      >
                                        {t('close')}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={basicForm.control}
                          name='bio'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor='bio'>
                                {t('brief_profile_description')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('enter_profile_description')}
                                  {...field}
                                  rows={5}
                                ></Textarea>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className='flex w-full justify-end gap-2'>
                          <Button
                            variant='destructive'
                            type='button'
                            onClick={() => setShowDeleteModal(true)}
                          >
                            {t('delete_account')}
                          </Button>
                          <Button
                            type='submit'
                            disabled={isBasicLoading}
                            className='btn btn--wide !ml-0 w-full !rounded-md'
                          >
                            {isBasicLoading && (
                              <Loader2 className='mr-2 size-4 animate-spin' />
                            )}
                            {t('save')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent
                    value='photo-gallery'
                    className='flex w-full flex-col gap-3'
                  >
                    <div className='flex flex-wrap gap-2'>
                      {gallery?.files?.length > 0 &&
                        gallery?.files.map((file: any) => (
                          <PreviewImage
                            key={file.path}
                            src={`https://proxy.paxintrade.com/400/https://img.paxintrade.com/${file.path}`}
                            onRemove={() => {
                              removeGallery(file.path);
                            }}
                          />
                        ))}
                    </div>
                    <div>
                      <ImageUpload ref={imageUploadRef} />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button
                        onClick={submitGallery}
                        disabled={isGalleryLoading}
                        className='btn btn--wide !rounded-md'
                      >
                        {isGalleryLoading && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        {t('save')}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value='additional'
                    className='flex w-full flex-col gap-3'
                  >
                    <div>
                      <ReactQuill
                        theme='snow'
                        modules={modules}
                        formats={formats}
                        value={additionalInfo}
                        onChange={(value: string) => setAdditionalInfo(value)}
                        placeholder='Дополнительная информация о вашем профиле здесь...'
                        className='placeholder:text-white'
                      />
                    </div>
                    <div className='flex w-full justify-end gap-2'>
                      <Button
                        onClick={submitAddtionalInfo}
                        disabled={isAdditionalLoading}
                        className='btn btn--wide !rounded-md'
                      >
                        {isAdditionalLoading && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        {t('save')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent className='my-2 w-full' value='telegram'>
              <div className='px-3'>
                <div className='text-2xl font-semibold'>
                  {t('telegram_integration')}
                </div>
                {profile?.telegram?.activated ? (
                  <div className='my-4'>
                    {t('you_account_is_already_activated')}
                  </div>
                ) : (
                  <>
                    <div className='my-4'>
                      {t.rich('copy_code_and_send_to_bot', {
                        botname: (children) => (
                          <Link
                            href='https://t.me/Paxintradebot'
                            target='_blank'
                          >
                            {children}
                          </Link>
                        ),
                      })}
                    </div>
                    <div className='flex items-center justify-between break-all rounded-lg bg-black/5 p-4 dark:bg-white/10'>
                      <div>{profile?.telegram?.token}</div>
                      <div>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() =>
                            handleLinkCopy(profile?.telegram?.token || '')
                          }
                        >
                          <RxCopy className='size-4' />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent className='w-full' value='subscription'>
              <div className='px-3'>
                <div className='flex flex-col justify-between text-2xl font-semibold sm:flex-row sm:items-end'>
                  <p>{t('subscription')}</p>
                  <div className='mt-4 flex w-full gap-2 sm:mt-0 sm:w-auto'>
                    <Button
                      className='h-7 w-1/2 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                      data-state={
                        !searchParams.get('mode') ||
                        searchParams.get('mode') === 'monthly'
                          ? 'active'
                          : ''
                      }
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams
                        );
                        newSearchParams.set('mode', 'monthly');

                        router.push(`?${newSearchParams.toString()}`);
                      }}
                    >
                      Monthly
                    </Button>
                    <Button
                      className='h-7 w-1/2 bg-background text-inherit shadow-none hover:bg-primary/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
                      data-state={
                        searchParams.get('mode') === 'annually' ? 'active' : ''
                      }
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams
                        );
                        newSearchParams.set('mode', 'annually');

                        router.push(`?${newSearchParams.toString()}`);
                      }}
                    >
                      Annually
                    </Button>
                  </div>
                </div>
                <div className='mt-4 flex w-full flex-col items-center gap-4'>
                  {subscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      {...subscription}
                      onUpgrade={() => {
                        setUpgradeLevel(subscription.id);
                        setShowUpgradeModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
