import React from 'react';
import styles from './market-overview.module.scss';

export const MarketOverview = () => {
  return (
    <section id="market-overview" className={styles.marketOverview}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.badge}>Аналитика</div>
            <h2 className={styles.title}>Обзор рынка (Market overview)</h2>
            <p className={styles.description}>
              Верхне-уровневая динамика основных показателей в различных срезах рынка (по категории/сегменту/бренду и тд).
            </p>
            <div className={styles.stepBox}>
              <h4 className={styles.stepTitle}>Как это работает?</h4>
              <ol className={styles.steps}>
                <li>Выставьте нужные параметры фильтров</li>
                <li>Нажмите на иконку в правом верхнем углу</li>
                <li>Введите название группы фильтров для сохранения</li>
                <li>Закрепляйте, Редактируйте и Удаляйте сохраненные наборы</li>
              </ol>
            </div>
          </div>
          <div className={styles.visuals}>
            <div className={styles.filterCard}>
              <div className={styles.filterLine}></div>
              <div className={styles.filterLine}></div>
              <div className={styles.filterLine} style={{ width: '50%' }}></div>
            </div>
            <div className={styles.mainVisual}>
              <div className={styles.visualTitle}>Динамика рынка</div>
              <div className={styles.chartLines}>
                <div className={styles.line} style={{ height: '40%', left: '10%' }}></div>
                <div className={styles.line} style={{ height: '70%', left: '30%' }}></div>
                <div className={styles.line} style={{ height: '50%', left: '50%' }}></div>
                <div className={styles.line} style={{ height: '80%', left: '70%' }}></div>
                <div className={styles.line} style={{ height: '60%', left: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
