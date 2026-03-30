---
sidebar_position: 2
---

# Input

Компонент **Input** — это универсальное поле ввода с поддержкой различных типов, размеров, состояний (ошибка, успех, предупреждение) и дополнительных элементов (иконки, подсказки).

## Пример использования

```tsx
import { Input } from '@shared/ui';

const MyComponent = () => {
  return (
    <Input 
      label="Email" 
      placeholder="Введите email" 
      type="email"
      error="Некорректный формат email"
    />
  );
};
```

## Свойства (Props)

| Свойство | Тип | По умолчанию | Описание |
| :--- | :--- | :--- | :--- |
| `type` | `InputType` | `'text'` | Тип поля (text, email, password, color и др.) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Размер поля |
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Стиль оформления |
| `state` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` | Визуальное состояние |
| `label` | `ReactNode` | — | Заголовок над полем |
| `hint` | `ReactNode` | — | Подсказка под полем |
| `error` | `string` | — | Сообщение об ошибке (показывается через тултип или под полем) |
| `leftIcon` | `ReactNode` | — | Иконка внутри поля слева |
| `rightIcon` | `ReactNode` | — | Иконка внутри поля справа |
| `leftElement` | `ReactNode` | — | Элемент (не иконка) внутри поля слева |
| `rightElement` | `ReactNode` | — | Элемент (не иконка) внутри поля справа |
| `clearable` | `boolean` | `false` | Позволяет очистить поле одной кнопкой |
| `block` | `boolean` | `false` | Растягивание на всю ширину контейнера |

## Особенности реализации

- **Тултипы ошибок**: При передаче пропса `error`, компонент может показывать ошибку через всплывающую подсказку ([ErrorTooltip](file:///c:/romir-frontend/bi/next-app-pattern/src/shared/ui/error-tooltip/error-tooltip.tsx)).
- **Автоматическое скрытие ошибки**: Поддерживает пропс `autoHideError`, который скрывает сообщение об ошибке через 5 секунд.
- **Интеграция с темами**: Поля ввода полностью поддерживают светлую и темную темы.
