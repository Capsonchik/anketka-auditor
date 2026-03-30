'use client'

import React from 'react';
import styles from './features.module.scss';

const features = [
  {
    title: 'Скорость получения данных',
    description: 'данные доступны в личном кабинете пользователя через 24 часа после проведения оплаты',
    isPrimary: true,
  },
  {
    title: 'Регулярность обновления данных',
    description: 'Данные обновляются каждый квартал',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: 'Надежность и достоверность аналитики',
    description: '',
    list: [
      'Все данные предоставляются на основании реальных покупок, подтвержденные чеками',
      'Все данные проходят строгий методологический контроль с обеспечением репрезентативности',
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: 'Экономическая доступность',
    description: 'Доступная стоимость данных за счет готовых автоматизированных решений, не требующих кастомных выгрузок и подготовки индивидуальных PPT презентаций',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
];

export const Features = () => {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Почему выбирают нашу платформу?</h2>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${feature.isPrimary ? styles.primary : ''}`}
            >
              <div>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  {feature.icon && (
                    <div className={styles.iconWrapper}>
                      {feature.icon}
                    </div>
                  )}
                </div>
                
                {feature.description && (
                  <p className={styles.cardDescription}>{feature.description}</p>
                )}
                
                {feature.list && (
                  <ul className={styles.checkList}>
                    {feature.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
