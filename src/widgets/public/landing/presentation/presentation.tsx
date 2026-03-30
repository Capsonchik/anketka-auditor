import React from 'react';
import { Button } from '@shared/ui';
import styles from './presentation.module.scss';

export const PresentationConstructor = () => {
  return (
    <section id="presentation" className={styles.presentation}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.canvas}>
              <div className={styles.slide}>
                <div className={styles.slideHeader}></div>
                <div className={styles.slideGrid}>
                  <div className={styles.slideBox}></div>
                  <div className={styles.slideBox}></div>
                </div>
                <div className={styles.slideFooter}></div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.badge}>Новинка</div>
            <h2 className={styles.title}>Конструктор презентаций</h2>
            <p className={styles.description}>
              Создавайте любое количество слайдов, добавляя на них графики, 
              предварительно настроенные в соответствующем разделе.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.number}>1</span>
                <div>
                  <h4>Индивидуальный дизайн</h4>
                  <p>Размещайте графики в любой последовательности, меняйте их размер и шаблоны.</p>
                </div>
              </li>
              <li className={styles.listItem}>
                <span className={styles.number}>2</span>
                <div>
                  <h4>Активное взаимодействие</h4>
                  <p>Сохраняйте в формате .pptx — все графики остаются активными для редактирования.</p>
                </div>
              </li>
              <li className={styles.listItem}>
                <span className={styles.number}>3</span>
                <div>
                  <h4>Гибкость настройки</h4>
                  <p>Корректируйте фильтры в процессе создания прямо внутри конструктора.</p>
                </div>
              </li>
            </ul>
            <div className={styles.actions}>
              <Button variant="primary" appearance="primary">Попробовать конструктор</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
