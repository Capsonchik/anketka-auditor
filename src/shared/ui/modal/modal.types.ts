import { ReactNode } from 'react';

/**
 * Свойства компонента Modal
 */
export interface ModalProps {
  /**
   * Контент модального окна
   */
  children?: ReactNode;

  /**
   * Указывает, открыто ли модальное окно
   */
  isOpen?: boolean;

  /**
   * Обработчик закрытия модального окна
   */
  onClose?: () => void;

  /**
   * Поведение подложки (backdrop):
   * - true: подложка отображается, клик по ней закрывает окно
   * - false: подложка не отображается
   * - 'static': подложка отображается, но клик по ней не закрывает окно (показывает анимацию запрета)
   * @default true
   */
  backdrop?: boolean | 'static';

  /**
   * Дополнительный класс для контейнера модального окна
   */
  className?: string;

  /**
   * Дополнительный класс для самой модалки
   */
  modalClassName?: string;

  /**
   * Ширина модального окна (например, 'xs', 'sm', 'md', 'lg', 'full' или конкретное значение)
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full' | string;

  /**
   * Вертикальное центрирование
   * @default true
   */
  centered?: boolean;
}
