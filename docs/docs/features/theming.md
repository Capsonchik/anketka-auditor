---
sidebar_position: 6
---

# Динамическая тема и ColorPicker

Приложение поддерживает полноценную систему тем (светлая/темная) и возможность динамической настройки основного цвета бренда пользователем.

## Переключение темы (`ThemeToggle`)

За управление темами отвечает компонент [ThemeToggle](file:///c:/romir-frontend/bi/next-app-pattern/src/features/theme-toggle/ui/theme-toggle.tsx).

- **Хранение**: Выбор пользователя сохраняется в `localStorage` под ключом `app-theme`.
- **Автоопределение**: При первом посещении тема определяется на основе системных настроек пользователя.
- **Применение**: Тема применяется путем установки атрибута `data-theme` на элемент `html`.

## Настройка цвета (`ColorPicker`)

Функция [ColorPicker](file:///c:/romir-frontend/bi/next-app-pattern/src/features/color-picker/ui/color-picker.tsx) позволяет пользователю выбрать любой цвет в качестве основного (`primary`).

- **Мгновенное применение**: При выборе цвета в палитре, изменения сразу применяются ко всему приложению через CSS-переменную `--primary-500`.
- **Автоматические оттенки**: Система автоматически рассчитывает темный оттенок цвета (на 20% темнее) и записывает его в `--primary-700`. Это необходимо для корректной работы анимаций кнопок.
- **Сброс**: Пользователь может в любой момент вернуть стандартный оранжевый цвет бренда (`#ff8200`).

## Интеграция в код

Для работы с темой в компонентах рекомендуется использовать хук `useTheme`:

```tsx
import { useTheme } from '@shared/hooks';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      Текущая тема: {theme}
      <button onClick={() => setTheme('dark')}>Сделать темно</button>
    </div>
  );
};
```

Для управления цветом используются функции из библиотеки [theme.ts](file:///c:/romir-frontend/bi/next-app-pattern/src/shared/lib/theme.ts):

- `applyPrimaryColor(color)` — установка цвета в CSS.
- `setPrimaryColor(color)` — сохранение цвета в `localStorage`.
- `resetPrimaryColor()` — возврат к заводским настройкам.
