import type { Meta, StoryObj } from '@storybook/react';
import { CheckPicker } from './check-picker';

const meta = {
  title: 'Shared/UI/CheckPicker',
  component: CheckPicker,
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
} satisfies Meta<typeof CheckPicker>;

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
    placeholder: 'Select Users',
    style: { width: 224 },
  },
};

export const WithValues: Story = {
  args: {
    data: mockData,
    value: ['Eugenia', 'Kariane'],
    style: { width: 224 },
  },
};

export const Disabled: Story = {
  args: {
    data: mockData,
    disabled: true,
    value: ['Eugenia'],
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
