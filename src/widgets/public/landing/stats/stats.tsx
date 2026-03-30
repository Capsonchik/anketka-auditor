'use client'

import React from 'react';
import styles from './stats.module.scss';

const stats = [
  { label: 'Покупок еженедельно', value: '900K', badge: '+12%', isPositive: true },
  { label: 'Данных обработано', value: '150M+', badge: 'REAL-TIME', isPositive: false },
  { label: 'Категорий рынка', value: '120', badge: 'NEW', isPositive: true },
  { label: 'Скорость обновления', value: 'Q4', badge: 'UPDATED', isPositive: false },
];

export const Stats = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.card}>
              <span className={styles.label}>{stat.label}</span>
              <div className={styles.valueRow}>
                <span className={styles.value}>{stat.value}</span>
                {stat.badge && (
                  <span className={`${styles.badge} ${stat.isPositive ? styles.positive : styles.neutral}`}>
                    {stat.badge}
                    {stat.isPositive && stat.badge.includes('%') && ' ↗'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
