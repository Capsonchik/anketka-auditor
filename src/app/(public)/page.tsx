import React from 'react';
import { Header } from '@widgets/public/header/header';
import { Hero } from '@widgets/public/landing/hero/hero';
import { Stats } from '@widgets/public/landing/stats/stats';
import { Solutions } from '@widgets/public/landing/solutions/solutions';
import { Features } from '@widgets/public/landing/features/features';
import { Methodology } from '@widgets/public/landing/methodology/methodology';
import { MarketOverview } from '@widgets/public/landing/market-overview/market-overview';
import { Charts } from '@widgets/public/landing/charts/charts';
import { PresentationConstructor } from '@widgets/public/landing/presentation/presentation';
import { ScrollToTop } from '@shared/ui/scroll-to-top/scroll-to-top';

export default function HomePage() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Solutions />
        <Features />
        <Methodology />
        <MarketOverview />
        <Charts />
        <PresentationConstructor />
      </main>
      <footer style={{ padding: '40px 0', backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', color: '#a0a0a0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <p>© {new Date().getFullYear()} РОМИР BI. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
}
