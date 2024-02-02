import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('main');
  return (
    <div className="h-[100px] flex  md:hidden md:h-[250px] lg:h-[350px] w-full items-center justify-center bg-[url('/images/contact/hero.jpg')] bg-cover  bg-[center_top_-15px] bg-no-repeat">
      <div className='ml-0 container text-3xl hidden md:block font-bold text-white  md:text-7xl'>
        {t('contact_us')}
      </div>
    </div>
  );
}
