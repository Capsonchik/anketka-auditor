import type { Meta, StoryObj } from '@storybook/react';
import { SelectPicker } from './select-picker';

const meta = {
  title: 'Shared/UI/SelectPicker',
  component: SelectPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    cleanable: { control: 'boolean' },
    searchable: { control: 'boolean' },
    block: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} satisfies Meta<typeof SelectPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
  { label: 'Eugenia', value: 'Eugenia', role: 'Master' },
  { label: 'Kariane', value: 'Kariane', role: 'Master' },
  { label: 'Louisa', value: 'Louisa', role: 'Master' },
  { label: 'Marty', value: 'Marty', role: 'Master' },
  { label: 'Kenya', value: 'Kenya', role: 'Master' },
  { label: 'Hal', value: 'Hal', role: 'Developer' },
  { label: 'Julius', value: 'Julius', role: 'Developer' },
  { label: 'Travon', value: 'Travon', role: 'Developer' },
  { label: 'Vincenza', value: 'Vincenza', role: 'Developer' },
  { label: 'Dominic', value: 'Dominic', role: 'Developer' },
];

export const Default: Story = {
  args: {
    data: mockData,
    placeholder: 'Select User',
    style: { width: 224 },
  },
};

export const Disabled: Story = {
  args: {
    data: mockData,
    placeholder: 'Select User',
    disabled: true,
    style: { width: 224 },
  },
};

export const Loading: Story = {
  args: {
    data: mockData,
    placeholder: 'Loading...',
    loading: true,
    style: { width: 224 },
  },
};

export const WithValue: Story = {
  args: {
    data: mockData,
    value: 'Eugenia',
    style: { width: 224 },
  },
};

export const Block: Story = {
  args: {
    data: mockData,
    block: true,
    placeholder: 'Full width',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};
