'use client'

import React from 'react';
import { Button } from '@shared/ui';
import styles from './solutions.module.scss';

export const Solutions = () => {
  return (
    <section id="solutions" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Инструменты для любой задачи</h2>
          <p className={styles.subtitle}>
            От готовых категорийных отчетов до продвинутого конструктора аналитики
          </p>
        </div>

        <div className={styles.grid}>
          {/* Card 1: Ready Solutions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Готовые решения</span>
              <h3 className={styles.cardTitle}>Готовые категорийные отчеты</h3>
              <p className={styles.cardDescription}>
                Мгновенный доступ к аналитике рынка. Выберите категорию и получите готовый дашборд с ключевыми метриками.
              </p>
              <ul className={styles.featureList}>
                <li>Преднастроенный готовый отчет по категории</li>
                <li>Все основные показатели категории в одном отчете</li>
                <li>Высокая скорость получения данных через BI личный кабинет</li>
                <li>Данные в формате графиков, сводной таблицы и «построение дерева категории»</li>
                <li>Возможность выгружать данные</li>
                <li>Доступная цена отчета</li>
              </ul>
              <Button variant="primary" appearance="ghost">Перейти в каталог</Button>
            </div>
            <div className={styles.cardVisual}></div>
          </div>

          {/* Card 2: Pro Tools */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Создай свой отчет</span>
              <h3 className={styles.cardTitle}>Конструктор аналитики</h3>
              <p className={styles.cardDescription}>
                Создавайте уникальные отчеты, настраивайте кросс-таблицы и визуализируйте данные под свои задачи.
              </p>
              <ul className={styles.featureList}>
                <li>Индивидуальная настройка метрик для категории</li>
                <li>Глубокий детальный анализ</li>
                <li>Высокая скорость получения данных через BI личный кабинет</li>
                <li>Сохранение шаблона настроенного отчета</li>
                <li>Возможность выгружать данные</li>
                <li>Доступная цена отчета</li>
              </ul>
              <Button variant="primary" appearance="primary">Создать анализ</Button>
            </div>
            <div className={styles.cardVisual}></div>
          </div>
        </div>
      </div>
    </section>
  );
};
