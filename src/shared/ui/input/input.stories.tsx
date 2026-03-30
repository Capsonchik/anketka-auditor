import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input, Textarea } from './input';

const meta = {
  title: 'Shared/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Компонент Input — универсальный компонент для ввода данных.

## Основные возможности:
- **15 типов**: text, email, password, number, tel, url, search, time, datetime-local, date, month, week, color
- **5 размеров**: xs, sm, md, lg, xl
- **4 варианта**: default, filled, flushed, unstyled
- **4 состояния**: default, success, error, warning
- **Элементы**: leftIcon, rightIcon, leftElement, rightElement
- **Дополнительно**: label, hint, clearable, block
- **Textarea**: отдельный компонент для многострочного ввода
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'time', 'datetime-local', 'date', 'month', 'week', 'color'],
      description: 'Тип input элемента',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер компонента',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
      description: 'Вариант отображения',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
      description: 'Состояние компонента',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    label: {
      control: 'text',
      description: 'Лейбл компонента',
    },
    hint: {
      control: 'text',
      description: 'Подсказка под компонентом',
    },
    leftIcon: {
      control: false,
      description: 'Иконка слева',
    },
    rightIcon: {
      control: false,
      description: 'Иконка справа',
    },
    leftElement: {
      control: false,
      description: 'Элемент слева (например, префикс)',
    },
    rightElement: {
      control: false,
      description: 'Элемент справа (например, суффикс)',
    },
    clearable: {
      control: 'boolean',
      description: 'Кнопка очистки значения',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    block: {
      control: 'boolean',
      description: 'Растянуть на всю ширину',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Отключенное состояние',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Только для чтения',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Текст заглушки',
    },
    defaultValue: {
      control: 'text',
      description: 'Значение по умолчанию',
    },
    onChange: { action: 'changed' },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================
// Icons
// =============================================

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PercentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" x2="5" y1="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

// =============================================
// Default Stories
// =============================================

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    size: 'md',
    variant: 'default',
    state: 'default',
  },
};

// =============================================
// Sizes Stories
// =============================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="xs" placeholder="Extra Small (xs)" defaultValue="XS" />
      <Input size="sm" placeholder="Small (sm)" defaultValue="SM" />
      <Input size="md" placeholder="Medium (md)" defaultValue="MD" />
      <Input size="lg" placeholder="Large (lg)" defaultValue="LG" />
      <Input size="xl" placeholder="Extra Large (xl)" defaultValue="XL" />
    </div>
  ),
};

export const SizeXS: Story = {
  args: {
    size: 'xs',
    placeholder: 'Extra Small',
  },
};

export const SizeSM: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small',
  },
};

export const SizeMD: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium',
  },
};

export const SizeLG: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large',
  },
};

export const SizeXL: Story = {
  args: {
    size: 'xl',
    placeholder: 'Extra Large',
  },
};

// =============================================
// Variants Stories
// =============================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="default" placeholder="Default Variant" defaultValue="Default" />
      <Input variant="filled" placeholder="Filled Variant" defaultValue="Filled" />
      <Input variant="flushed" placeholder="Flushed Variant" defaultValue="Flushed" />
      <Input variant="unstyled" placeholder="Unstyled Variant" defaultValue="Unstyled" />
    </div>
  ),
};

export const VariantDefault: Story = {
  args: {
    variant: 'default',
    placeholder: 'Default variant',
  },
};

export const VariantFilled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

export const VariantFlushed: Story = {
  args: {
    variant: 'flushed',
    placeholder: 'Flushed variant',
  },
};

export const VariantUnstyled: Story = {
  args: {
    variant: 'unstyled',
    placeholder: 'Unstyled variant',
  },
};

// =============================================
// States Stories
// =============================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input state="default" placeholder="Default State" defaultValue="Default" />
      <Input state="success" placeholder="Success State" defaultValue="Success" leftIcon={<CheckIcon />} hint="Valid input" />
      <Input state="error" placeholder="Error State" defaultValue="Error" leftIcon={<ErrorIcon />} hint="Invalid input" />
      <Input state="warning" placeholder="Warning State" defaultValue="Warning" hint="Check your input" />
    </div>
  ),
};

export const StateDefault: Story = {
  args: {
    state: 'default',
    placeholder: 'Default state',
  },
};

export const StateSuccess: Story = {
  args: {
    state: 'success',
    placeholder: 'Success state',
    leftIcon: <CheckIcon />,
    hint: 'Valid input',
  },
};

export const StateError: Story = {
  args: {
    state: 'error',
    placeholder: 'Error state',
    leftIcon: <ErrorIcon />,
    hint: 'Invalid input',
  },
};

export const StateWarning: Story = {
  args: {
    state: 'warning',
    placeholder: 'Warning state',
    hint: 'Check your input',
  },
};

// =============================================
// Types Stories
// =============================================

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px' }}>
      <Input type="text" placeholder="Text" label="Text" />
      <Input type="email" placeholder="email@example.com" label="Email" />
      <Input type="password" placeholder="Password" label="Password" />
      <Input type="number" placeholder="0" label="Number" />
      <Input type="tel" placeholder="+1 (555) 000-0000" label="Telephone" />
      <Input type="url" placeholder="https://example.com" label="URL" />
      <Input type="search" placeholder="Search..." label="Search" />
      <Input type="date" label="Date" />
      <Input type="time" label="Time" />
      <Input type="datetime-local" label="DateTime" />
      <Input type="month" label="Month" />
      <Input type="week" label="Week" />
      <Input type="color" label="Color" />
    </div>
  ),
};

export const TypeEmail: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
    label: 'Email',
    leftIcon: <MailIcon />,
  },
};

export const TypePassword: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    label: 'Password',
    leftIcon: <LockIcon />,
    rightIcon: <EyeIcon />,
  },
};

export const TypeSearch: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    label: 'Search',
    leftIcon: <SearchIcon />,
    clearable: true,
  },
};

export const TypeColor: Story = {
  args: {
    type: 'color',
    label: 'Select Color',
  },
};

// =============================================
// With Icons Stories
// =============================================

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input leftIcon={<SearchIcon />} placeholder="Search..." />
      <Input rightIcon={<CalendarIcon />} placeholder="Select date" />
      <Input leftIcon={<MailIcon />} rightIcon={<CheckIcon />} placeholder="Email" />
      <Input leftIcon={<LockIcon />} type="password" placeholder="Password" />
    </div>
  ),
};

export const LeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <SearchIcon />,
  },
};

export const RightIcon: Story = {
  args: {
    placeholder: 'Select date',
    rightIcon: <CalendarIcon />,
  },
};

export const BothIcons: Story = {
  args: {
    placeholder: 'Email',
    leftIcon: <MailIcon />,
    rightIcon: <CheckIcon />,
  },
};

// =============================================
// With Elements Stories
// =============================================

export const WithElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input 
        leftElement={
          <span style={{ fontWeight: 500, color: '#666' }}>$</span>
        } 
        placeholder="0.00" 
      />
      <Input 
        rightElement={
          <span style={{ fontWeight: 500, color: '#666' }}>USD</span>
        } 
        placeholder="0.00" 
      />
      <Input 
        leftElement={
          <span style={{ fontWeight: 500, color: '#666' }}>+1</span>
        } 
        type="tel"
        placeholder="(555) 000-0000" 
      />
      <Input 
        rightElement={
          <span style={{ fontWeight: 500, color: '#666' }}>%</span>
        } 
        type="number"
        placeholder="0" 
      />
    </div>
  ),
};

export const LeftElement: Story = {
  args: {
    placeholder: '0.00',
    leftElement: (
      <span style={{ fontWeight: 500, color: '#666' }}>$</span>
    ),
  },
};

export const RightElement: Story = {
  args: {
    placeholder: '0.00',
    rightElement: (
      <span style={{ fontWeight: 500, color: '#666' }}>USD</span>
    ),
  },
};

// =============================================
// Label & Hint Stories
// =============================================

export const WithLabelAndHint: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input label="Username" placeholder="Enter username" hint="Choose a unique username" />
      <Input label="Email" placeholder="Enter email" hint="We'll never share your email" />
      <Input 
        label="Password" 
        type="password" 
        placeholder="Enter password" 
        hint="Must be at least 8 characters"
        leftIcon={<LockIcon />}
      />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
  },
};

export const WithHint: Story = {
  args: {
    placeholder: 'Enter username',
    hint: 'Choose a unique username',
  },
};

// =============================================
// States Stories (Disabled, ReadOnly, etc.)
// =============================================

export const AllStatesExtended: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input placeholder="Normal" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Read Only" readOnly defaultValue="Cannot edit this" />
      <Input placeholder="With value" defaultValue="Pre-filled value" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'Read only input',
    readOnly: true,
    defaultValue: 'Cannot edit this',
  },
};

export const Clearable: Story = {
  args: {
    placeholder: 'Clearable input',
    clearable: true,
    defaultValue: 'Click X to clear',
  },
};

export const Block: Story = {
  args: {
    placeholder: 'Block input (100% width)',
    block: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// =============================================
// Textarea Stories
// =============================================

export const TextareaDefault: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Textarea placeholder="Enter your message..." label="Message" />
    </div>
  ),
};

export const TextareaAllSizes: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      <Textarea size="xs" placeholder="XS" rows={2} />
      <Textarea size="sm" placeholder="SM" rows={2} />
      <Textarea size="md" placeholder="MD" rows={3} />
      <Textarea size="lg" placeholder="LG" rows={3} />
      <Textarea size="xl" placeholder="XL" rows={4} />
    </div>
  ),
};

export const TextareaAllVariants: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Textarea variant="default" placeholder="Default" rows={3} />
      <Textarea variant="filled" placeholder="Filled" rows={3} />
      <Textarea variant="flushed" placeholder="Flushed" rows={3} />
    </div>
  ),
};

export const TextareaWithIcons: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Textarea leftIcon={<MailIcon />} placeholder="With left icon" rows={3} />
      <Textarea rightIcon={<CheckIcon />} placeholder="With right icon" rows={3} />
    </div>
  ),
};

export const TextareaStates: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Textarea state="default" placeholder="Default" rows={2} />
      <Textarea state="success" placeholder="Success" rows={2} hint="Looks good!" />
      <Textarea state="error" placeholder="Error" rows={2} hint="Please fix this" />
      <Textarea state="warning" placeholder="Warning" rows={2} hint="Check your input" />
    </div>
  ),
};

// =============================================
// Combinations Stories
// =============================================

export const SizeVariantMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ width: '30px', fontSize: '12px', color: '#666' }}>{size}</span>
          <Input size={size} variant="default" placeholder="Default" style={{ width: '150px' }} />
          <Input size={size} variant="filled" placeholder="Filled" style={{ width: '150px' }} />
          <Input size={size} variant="flushed" placeholder="Flushed" style={{ width: '150px' }} />
        </div>
      ))}
    </div>
  ),
};

export const FullDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '500px' }}>
      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input size="xs" placeholder="Extra Small" />
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
          <Input size="xl" placeholder="Extra Large" />
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Variants</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input variant="default" placeholder="Default" />
          <Input variant="filled" placeholder="Filled" />
          <Input variant="flushed" placeholder="Flushed" />
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input state="default" placeholder="Default" />
          <Input state="success" placeholder="Success" hint="Valid!" />
          <Input state="error" placeholder="Error" hint="Invalid!" />
          <Input state="warning" placeholder="Warning" hint="Check this" />
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>With Icons</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input leftIcon={<SearchIcon />} placeholder="Search" />
          <Input rightIcon={<MailIcon />} placeholder="Email" />
          <Input leftIcon={<LockIcon />} rightIcon={<EyeIcon />} type="password" placeholder="Password" />
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Textarea</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Textarea placeholder="Enter your message..." label="Message" hint="Max 500 characters" />
        </div>
      </section>
    </div>
  ),
};
