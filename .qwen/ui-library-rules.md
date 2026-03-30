# Правила создания UI-библиотеки в стиле React Suite (единая дизайн-система)

## 1. Общие принципы

Все компоненты должны быть визуально и функционально согласованы, как в React Suite: единые отступы, цветовая схема, скругления, тени, анимации.

Компоненты должны быть гибкими и поддерживать кастомизацию через пропсы, темы и render-пропсы.

Каждый компонент разрабатывается изолированно, но с учётом взаимодействия с другими (например, Modal и Button должны сочетаться).

Используется единый токен-дизайн (цвета, шрифты, размеры) через CSS-переменные.

## 2. Организация файлов (как в React Suite)

```
shared/ui/
  ├── Button/
  │   ├── Button.tsx
  │   ├── Button.module.scss
  │   ├── Button.stories.tsx
  │   ├── Button.test.tsx
  │   ├── index.ts
  │   └── README.md (опционально)
  ├── Modal/
  │   ├── Modal.tsx
  │   ├── ModalHeader.tsx (если сложный)
  │   ├── ModalFooter.tsx
  │   ├── Modal.module.scss
  │   ├── Modal.stories.tsx
  │   ├── Modal.test.tsx
  │   └── index.ts
  ├── SelectPicker/
  ├── CheckPicker/
  ├── TagPicker/
  ├── Drawer/
  ├── Toggle/
  ├── Accordion/
  ├── Loader/
  ├── index.ts (публичное API)
  └── ...
```

## 3. Единый стиль пропсов (API компонентов)

### 3.1. Базовые пропсы (общие для всех)

- `className?: string` — для добавления внешних классов (объединяется через clsx).
- `style?: React.CSSProperties` — инлайн-стили.
- `children?: React.ReactNode` — если компонент-контейнер.
- `testId?: string` — для тестирования.
- `as?: React.ElementType` — для возможности рендерить компонент как другой HTML-тег или компонент (полиморфизм). Использовать с осторожностью, как в React Suite.

### 3.2. Пропсы внешнего вида и состояния

- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` — предопределённые размеры (аналогично React Suite).
- `variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost'` — цветовые варианты.
- `appearance?: 'default' | 'subtle' | 'ghost'` — для некоторых компонентов (как в React Suite).
- `disabled?: boolean`
- `loading?: boolean` — состояние загрузки (показывать спиннер внутри).
- `readOnly?: boolean`
- `error?: boolean | string` — состояние ошибки с сообщением (для полей ввода).
- `block?: boolean` — занимать всю ширину родителя (как в React Suite).

### 3.3. Пропсы для событий

- `onClick`, `onChange`, `onFocus`, `onBlur`, `onKeyDown` — стандартные обработчики с правильной типизацией.
- Для управляемых компонентов (поле ввода, селект) используйте `value` и `defaultValue`.
- Для колбэков, специфичных для компонента, придерживайтесь именования `onXxx`, например, `onSelect`, `onClean`, `onOpen`, `onClose`.

### 3.4. Пропсы для кастомизации (render props)

- `renderXxx?: (props) => React.ReactNode` — для кастомизации отдельных частей (например, `renderOption` для селекта, `renderValue` для picker'ов).
- `components?: { Xxx: React.ComponentType }` — для замены внутренних компонентов (например, `components={{ Option: CustomOption }}`).

### 3.5. Пропсы для доступности

- `aria-label`, `aria-labelledby` и другие ARIA-атрибуты должны передаваться через rest props или явно объявляться.

### 3.6. Типизация

- Все пропсы выносятся в интерфейс с суффиксом `Props` (например, `ButtonProps`).
- Используйте `extends` от стандартных интерфейсов, если компонент основан на нативном элементе (например, `React.ButtonHTMLAttributes<HTMLButtonElement>`).

## 4. Стилизация и темизация

Используйте **SCSS-модули** (`.module.scss`) для изоляции стилей.

Все дизайн-токены (цвета, отступы, радиусы, тени, шрифты) вынесены в SCSS-переменные в `shared/styles/variables/`. Пример:

```scss
// _colors.scss
$color-primary: #1675e0;
$color-primary-hover: #0a5dc2;
$color-primary-active: #094a9c;
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;

// _sizes.scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;

// _radius.scss
$radius-sm: 2px;
$radius-md: 4px;
$radius-lg: 6px;

// _typography.scss
$font-size-sm: 12px;
$font-size-md: 14px;
$font-size-lg: 16px;

// _transitions.scss
$transition-base: 0.2s ease-in-out;
```

Для импорта переменных в начале файла компонента:

```scss
@import '../../styles/variables/colors';
@import '../../styles/variables/sizes';
@import '../../styles/variables/radius';
```

Или используйте глобальный импорт через `next.config.ts` для автоматического подключения.

Для адаптивности используйте миксины, например `@include responsive-prop(padding, 8px, 12px, 16px);`.

Все стили пишутся с использованием этих переменных, чтобы обеспечить смену темы.

Для вариантов (variant) создавайте модификаторы классов, например `.button-primary`, `.button-success` или используйте `data-attributes`.

## 5. Storybook для документирования

Обязательно для каждого компонента создавать stories, демонстрирующие все возможные состояния.

Используйте Controls для интерактивного изменения пропсов.

Добавляйте описания к пропсам через `argTypes`.

Группируйте компоненты по категориям (например, "General", "Data Entry", "Feedback").

Для сложных компонентов (например, SelectPicker) покажите примеры с данными, с подгрузкой, с поиском.

Используйте MDX для создания документации с пояснениями и примерами кода.

## 6. Тестирование

Юнит-тесты (Jest + React Testing Library) проверяют:

- Рендер компонента с разными пропсами.
- Корректное применение классов и стилей.
- Вызов обработчиков событий.
- Состояния (disabled, loading).
- Snapshots (опционально) для контроля неожиданных изменений.

E2E / интеграционные тесты для сложных компонентов (например, модалка с открытием/закрытием).

Тесты доступности с помощью `jest-axe`.

## 7. Доступность (a11y)

Все интерактивные компоненты должны поддерживать фокус и управление с клавиатуры (Tab, Enter, Space, стрелки).

Используйте семантические теги (`<button>`, `<input>`, `<select>`) или добавляйте соответствующие ARIA-роли.

Для сложных компонентов (селекты, picker'ы) добавляйте `aria-expanded`, `aria-haspopup`, `aria-activedescendant` и т.д.

Проверяйте цветовой контраст (особенно для вариантов).

В Storybook используйте аддон a11y.

## 8. Интернационализация (i18n)

Текстовые надписи (например, "ОК", "Отмена", "Загрузка...") должны быть вынесены в пропсы или контекст, чтобы их можно было переопределить (как в React Suite через locale-провайдер).

Для компонентов с внутренними текстами (например, пустое состояние селекта) добавьте пропс `locale` или используйте контекст.

## 9. Пример структуры компонента (вдохновляясь React Suite)

### Button.tsx

```tsx
import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';
import { Loader } from '../Loader';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
  appearance?: 'default' | 'subtle' | 'ghost';
  block?: boolean;
  loading?: boolean;
  active?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  size = 'md',
  variant = 'primary',
  appearance = 'default',
  block = false,
  loading = false,
  active = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[size],
        styles[variant],
        styles[`appearance-${appearance}`],
        block && styles.block,
        active && styles.active,
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size="sm" className={styles.loader} />}
      <span>{children}</span>
    </button>
  );
};
```

### Button.module.scss

```scss
@import '../../styles/variables/colors';
@import '../../styles/variables/sizes';
@import '../../styles/variables/radius';
@import '../../styles/variables/typography';
@import '../../styles/variables/transitions';

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $radius-md;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: pointer;
  transition: background $transition-base, color $transition-base, box-shadow $transition-base;
  white-space: nowrap;
  gap: $spacing-xs;
}

/* Размеры */
.xs { padding: $spacing-xs $spacing-sm; font-size: $font-size-xs; }
.sm { padding: $spacing-sm $spacing-md; font-size: $font-size-sm; }
.md { padding: $spacing-md $spacing-lg; font-size: $font-size-md; }
.lg { padding: $spacing-lg $spacing-xl; font-size: $font-size-lg; }
.xl { padding: $spacing-xl $spacing-2xl; font-size: $font-size-xl; }

/* Варианты и внешний вид */
.primary.appearance-default {
  background-color: $color-primary;
  color: white;
}
.primary.appearance-default:hover:not(:disabled) {
  background-color: $color-primary-hover;
}
/* ... остальные варианты */

.block {
  width: 100%;
}

.loading {
  opacity: 0.7;
  pointer-events: none;
}
```

## 10. Процесс добавления нового компонента

1. Определить API компонента, основываясь на аналогичном компоненте из React Suite (или другом эталоне). Составить список пропсов.
2. Создать папку компонента, файлы.
3. Реализовать компонент с TypeScript и стилями.
4. Написать stories для всех основных состояний.
5. Написать юнит-тесты.
6. Добавить компонент в `shared/ui/index.ts`.
7. Обновить документацию (если есть общая документация дизайн-системы).
8. Проверить доступность и кросс-браузерность.

## 11. Инструменты для поддержки единообразия

- ESLint с плагинами для проверки имен пропсов, порядка импортов.
- Stylelint для проверки порядка CSS-свойств, использования переменных.
- Prettier для форматирования.
- Husky + lint-staged для проверки перед коммитом.

## 12. Заключение

Следуя этим правилам, вы создадите UI-библиотеку, аналогичную React Suite по качеству и согласованности. Это обеспечит:

- Быструю разработку новых экранов.
- Лёгкую поддержку и масштабирование.
- Единый пользовательский опыт во всём приложении.