import React from 'react';
import styles from './methodology.module.scss';

export const Methodology = () => {
  return (
    <section id="methodology" className={styles.methodology}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <div className={styles.badge}>Методология</div>
            <h2 className={styles.title}>Design & Methodology</h2>
            <p className={styles.description}>
              Краткая сводка с основной информации по исследованию: дизайн, уровни рынка, категории, 
              а также информация об анализируемых показателях.
            </p>
            <div className={styles.points}>
              <div className={styles.point}>
                <span className={styles.pointIcon}>📊</span>
                <div>
                  <h4>Дизайн исследования</h4>
                  <p>Основано на репрезентативной выборке домохозяйств.</p>
                </div>
              </div>
              <div className={styles.point}>
                <span className={styles.pointIcon}>📈</span>
                <div>
                  <h4>Уровни рынка</h4>
                  <p>Анализ на уровне страны, регионов и отдельных городов.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.imagePlaceholder}>
            <div className={styles.visualCard}>
              <div className={styles.visualBar} style={{ width: '80%' }}></div>
              <div className={styles.visualBar} style={{ width: '60%' }}></div>
              <div className={styles.visualBar} style={{ width: '90%' }}></div>
              <div className={styles.visualBar} style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
