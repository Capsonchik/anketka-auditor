---
sidebar_position: 4
---

# PillSwitchFlexible

Компонент **PillSwitchFlexible** — это гибкий переключатель с анимированным индикатором (пилюлей), который плавно перемещается между выбранными опциями.

## Пример использования

```tsx
import { PillSwitchFlexible } from '@shared/ui';

const options = [
  { label: 'День', value: 'day' },
  { label: 'Месяц', value: 'month' },
  { label: 'Год', value: 'year' },
];

const MyComponent = () => {
  const [period, setPeriod] = useState('month');

  return (
    <PillSwitchFlexible 
      data={options} 
      value={period} 
      onChange={setPeriod} 
    />
  );
};
```

## Свойства (Props)

| Свойство | Тип | По умолчанию | Описание |
| :--- | :--- | :--- | :--- |
| `data` | `PillOption[]` | — | Массив опций для выбора |
| `value` | `string \| number \| boolean` | — | Текущее выбранное значение |
| `onChange` | `(value: PillValue) => void` | — | Обработчик изменения значения |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Размер переключателя |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger'` | `'primary'` | Цветовая тема активного индикатора |
| `disabled` | `boolean` | `false` | Отключенное состояние всего компонента |

## Особенности реализации

- **Анимированный индикатор**: Использует `getBoundingClientRect` для точного расчета позиции и размеров индикатора, что позволяет "пилюле" плавно перетекать между пунктами разной ширины.
- **Поддержка иконок**: Каждая опция может содержать иконку в свойстве `icon`.
- **Доступность**: Реализован на основе радио-кнопок, что обеспечивает поддержку навигации с клавиатуры.
- **Реактивность**: Автоматически пересчитывает позицию индикатора при изменении размеров окна или прокрутке.
