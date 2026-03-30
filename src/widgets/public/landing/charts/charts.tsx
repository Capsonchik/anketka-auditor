import React from 'react';
import styles from './charts.module.scss';

export const Charts = () => {
  return (
    <section id="charts" className={styles.charts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>Инструменты</div>
          <h2 className={styles.title}>Интерактивные графики</h2>
          <p className={styles.subtitle}>
            Данные по показателям в формате столбчатых диаграмм как на уровне одного продукта, так и нескольких. 
            Возможность выбора необходимых срезов и динамики к предыдущему периоду.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h4>Динамика KPI</h4>
              <div className={styles.chartControls}>
                <span className={styles.control}>✏️</span>
                <span className={styles.control}>⚙️</span>
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.barContainer}>
                <div className={styles.bar} style={{ height: '60%' }}></div>
                <div className={styles.bar} style={{ height: '80%' }}></div>
                <div className={styles.bar} style={{ height: '40%' }}></div>
                <div className={styles.bar} style={{ height: '90%' }}></div>
                <div className={styles.bar} style={{ height: '55%' }}></div>
              </div>
            </div>
          </div>
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Настройка визуализации</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.check}>✓</span> 
                Изменение типа графика (столбчатый/линейный)
              </li>
              <li className={styles.listItem}>
                <span className={styles.check}>✓</span> 
                Управление осями и накоплением данных
              </li>
              <li className={styles.listItem}>
                <span className={styles.check}>✓</span> 
                Настройка форматов чисел и разрядности
              </li>
              <li className={styles.listItem}>
                <span className={styles.check}>✓</span> 
                Процентное изменение к предыдущему периоду
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
