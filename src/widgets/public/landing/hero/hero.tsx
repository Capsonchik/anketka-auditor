'use client';


import { Button } from '@shared/ui';

import styles from './hero.module.scss';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section id="hero" className={styles.hero}>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {t('РОМИР')} <span className={styles.accent}>{t('BI')}</span>
          </h1>
          <h2 className={styles.subtitle}>
            {t('Принимайте решения на основе ')}<span className={styles.highlight}>{t('данных')}</span>
          </h2>
          <p className={styles.description}>
            {t('Единая платформа для работы с маркетинговыми данными.')}
            {t('От готовых категорийных отчетов до глубокой кастомной аналитики.')}
          </p>
          <div className={styles.actions}>
            <Button animation="swipe" size="lg">Swipe</Button>
            <Button animation="diagonal-swipe" size="lg" variant='primary' appearance='subtile'>Diagonal Swipe</Button>
            <Button animation="double-swipe" size="lg" variant='primary' appearance='subtile'>Double Swipe</Button>
            <Button animation="diagonal-close" size="lg" variant='primary' appearance='subtile'>Diagonal Close</Button>
            <Button animation="zoning-in" size="lg" variant='primary' appearance='subtile'>Zoning In</Button>
            <Button animation="four-corners" size="lg" variant='primary' appearance='subtile'>4 Corners</Button>
          </div>
          <div className={styles.actions} style={{marginTop: 20}}>
            <Button animation="slice" size="lg" variant='primary' appearance='subtile'>Slice</Button>
            <Button animation="position-aware" size="lg" variant='primary' appearance='subtile'>Position Aware</Button>
            <Button animation="alternate" size="lg" variant='primary' appearance='subtile'>Alternate</Button>
            <Button animation="smoosh" size="lg" variant='primary' appearance='subtile'>Smoosh</Button>
       
          </div>
          <div className={styles.actions} style={{marginTop: 20}}>
            <Button animation="vertical-overlap" size="lg" variant='primary' appearance='subtile'>Vertical Overlap</Button>
            <Button animation="horizontal-overlap" size="lg" variant='primary' appearance='ghost'>Horizontal Overlap</Button>
            <Button animation="collision" size="lg" variant='primary' appearance='ghost'>Collision</Button>
          </div>
          <div className={styles.actions} style={{marginTop: 20}}>
            <Button animation="ripple" size="lg">Ripple</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
