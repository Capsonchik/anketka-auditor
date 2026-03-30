import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PhoneInput } from './phone-input';
import React, { useState } from 'react';

const meta = {
  title: 'Shared/UI/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Компонент PhoneInput — специализированный компонент для ввода номера телефона с поддержкой стран СНГ.

## Возможности:
- **Автоопределение страны**: определяет страну по введенному префиксу (например, +79... -> RU, +375... -> BY).
- **Маскирование**: автоматически форматирует номер согласно правилам выбранной страны.
- **Селектор стран**: удобный нативный селектор с флагами.
- **Нативный и доступный**: использует стандартные HTML элементы для максимальной совместимости и доступности.
- **СНГ поддержка**: Россия, Казахстан, Беларусь, Узбекистан и другие.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Значение телефона в формате +79998887766',
    },
    onChange: { action: 'changed' },
    disabled: {
      control: 'boolean',
      description: 'Отключенное состояние',
    },
    hideFlag: {
      control: 'boolean',
      description: 'Скрыть селектор флага',
    },
    allowedCountries: {
      control: 'check',
      options: ['RU', 'KZ', 'BY', 'UZ', 'KG', 'AM', 'AZ', 'TJ', 'MD'],
      description: 'Список разрешенных стран (коды ISO)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер (наследуется от Input)',
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
      description: 'Вариант отображения',
    },
    state: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
      description: 'Состояние (наследуется от Input)',
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Интерактивный пример с состоянием
const PhoneInputWithState = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <div style={{ width: '320px' }}>
      <PhoneInput 
        {...args} 
        value={value} 
        onChange={(val) => {
          setValue(val);
          args.onChange?.(val);
        }} 
      />
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        Raw value: <strong>{value}</strong>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Номер телефона',
    placeholder: 'Введите номер',
  },
};

export const PreFilled: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Предзаполненный (RU)',
    value: '+79001234567',
  },
};

export const Kazakhstan: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Казахстан',
    value: '+77001234567',
  },
};

export const Belarus: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Беларусь',
    value: '+375291234567',
  },
};

export const ErrorState: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Ошибка валидации',
    state: 'error',
    hint: 'Некорректный номер телефона',
  },
};

export const Disabled: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Заблокированный ввод',
    disabled: true,
    value: '+79001234567',
  },
};

export const CustomAllowedCountries: Story = {
  render: (args) => <PhoneInputWithState {...args} />,
  args: {
    label: 'Только RU и BY',
    allowedCountries: ['RU', 'BY'],
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px' }}>
      <PhoneInput size="sm" label="Small (sm)" />
      <PhoneInput size="md" label="Medium (md)" />
      <PhoneInput size="lg" label="Large (lg)" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px' }}>
      <PhoneInput variant="default" label="Default" />
      <PhoneInput variant="filled" label="Filled" />
      <PhoneInput variant="flushed" label="Flushed" />
    </div>
  ),
};

export const AllCISCountries: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', width: '600px' }}>
      {meta.argTypes.allowedCountries.options.map(code => (
        <PhoneInput key={code} value={`+${code === 'RU' || code === 'KZ' ? '7' : ''}`} allowedCountries={[code]} label={code} />
      ))}
    </div>
  ),
};
