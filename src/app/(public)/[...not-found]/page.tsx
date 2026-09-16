'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@shared/ui';
import styles from './page.module.scss';

/**
 * Страница 404 (Not Found)
 * 
 * Отображается, когда пользователь переходит на несуществующий маршрут.
 * Предоставляет возможность вернуться на главную страницу.
 */
export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/login')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.message}>
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className={styles.actions}>
            <Button appearance='ghost' rounded='md' animation='double-swipe' variant="primary" size="lg" onClick={handleGoHome}>
              Перейти ко входу
            </Button>
          </div>
        </div>
        <div className={styles.illustration}>
          <div className={styles.illustrationCircle} />
          <div className={styles.illustrationCircle} />
          <div className={styles.illustrationCircle} />
        </div>
      </div>
    </div>
  );
}
