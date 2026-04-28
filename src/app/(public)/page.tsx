import React from 'react';
import { Header } from '@widgets/public/header/header';
import { Hero } from '@/widgets/public/landing/hero/hero';
import { LandingProjectVariants } from '@/widgets/public/landing/project-variants/project-variants';
import { LandingManage } from '@/widgets/public/landing/manage/manage';
import { LandingTestimonials } from '@/widgets/public/landing/testimonials/testimonials';
import { LandingTariffs } from '@/widgets/public/landing/tariffs/tariffs';
import { ScrollToTop } from '@shared/ui/scroll-to-top/scroll-to-top';

export default function HomePage() {

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Hero />
        <LandingProjectVariants />
        <LandingManage />
        <LandingTestimonials />
        <LandingTariffs />
      </main>

    </>
  );
}
