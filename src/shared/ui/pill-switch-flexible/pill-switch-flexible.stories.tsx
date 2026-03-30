import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PillSwitchFlexible } from './pill-switch-flexible';
import type { PillOption, PillValue } from './pill-switch-flexible';

const meta = {
  title: 'shared/UI/PillSwitchFlexible',
  component: PillSwitchFlexible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'success', 'danger'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof PillSwitchFlexible>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData: PillOption[] = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: 'Год', value: 'year' },
];

const dataWithIcons: PillOption[] = [
  { label: 'Список', value: 'list', icon: '📋' },
  { label: 'Карточки', value: 'cards', icon: '🃏' },
  { label: 'Таблица', value: 'table', icon: '📊' },
];

const dataWithDisabled: PillOption[] = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Архив', value: 'archive', disabled: true },
  { label: 'Удаленные', value: 'deleted', disabled: true },
];

// Template for interactive stories
const InteractiveStory = (args: any) => {
  const [value, setValue] = useState<PillValue>(args.value);

  const handleChange = (newValue: PillValue) => {
    setValue(newValue);
    args.onChange(newValue); // Call the Storybook action
  };

  return <PillSwitchFlexible {...args} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'week',
    name: 'period',
  },
};

export const Small: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'week',
    size: 'small',
    name: 'period-small',
  },
};

export const Large: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'week',
    size: 'large',
    name: 'period-large',
  },
};

export const Success: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'month',
    variant: 'success',
    name: 'period-success',
  },
};

export const Danger: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'year',
    variant: 'danger',
    name: 'period-danger',
  },
};

export const WithIcons: Story = {
  render: InteractiveStory,
  args: {
    data: dataWithIcons,
    value: 'cards',
    name: 'view',
  },
};

export const WithDisabledOptions: Story = {
  render: InteractiveStory,
  args: {
    data: dataWithDisabled,
    value: 'active',
    name: 'filter',
  },
};

export const Disabled: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'day',
    disabled: true,
    name: 'period-disabled',
  },
};

export const CustomClassName: Story = {
  render: InteractiveStory,
  args: {
    data: sampleData,
    value: 'month',
    className: 'my-custom-class',
    name: 'period-custom',
  },
};
