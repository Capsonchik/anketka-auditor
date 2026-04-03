import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';
import type { ButtonAnimation } from './button.types';

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Кнопка — универсальный компонент для взаимодействия с пользователем.

## Основные возможности:
- **5 размеров**: xs, sm, md, lg, xl
- **3 стиля (appearance)**: default, subtile, ghost
- **6 цветов (variant)**: default, primary, success, warning, danger, info
- **5 видов скругления**: none, sm, md, lg, full
- **14 анимаций**: none, swipe, diagonal-swipe, double-swipe, diagonal-close, zoning-in, four-corners, slice, position-aware, alternate, smoosh, vertical-overlap, horizontal-overlap, collision, ripple
- **Иконки**: поддержка leftIcon и rightIcon
- **Состояния**: loading, disabled, active, block

## Анимации
Анимации работают с любым appearance. Миксины импортируются глобально и могут использоваться в любом компоненте.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер кнопки',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
      description: 'Цвет кнопки',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    appearance: {
      control: 'select',
      options: ['default', 'subtile', 'ghost'],
      description: 'Внешний вид кнопки',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Скругление углов',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    animation: {
      control: 'select',
      options: [
        'none',
        'swipe',
        'diagonal-swipe',
        'double-swipe',
        'diagonal-close',
        'zoning-in',
        'four-corners',
        'slice',
        'position-aware',
        'alternate',
        'smoosh',
        'vertical-overlap',
        'horizontal-overlap',
        'collision',
        'ripple',
      ],
      description: 'Тип анимации при наведении',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    block: {
      control: 'boolean',
      description: 'Кнопка на всю ширину родителя',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    active: {
      control: 'boolean',
      description: 'Активное состояние',
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
    leftIcon: {
      control: false,
      description: 'Иконка слева от текста',
    },
    rightIcon: {
      control: false,
      description: 'Иконка справа от текста',
    },
    children: {
      control: 'text',
      description: 'Текст кнопки',
    },
    onClick: { action: 'clicked' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================
// Default Stories
// =============================================

export const Default: Story = {
  args: {
    children: 'Button',
    size: 'md',
    variant: 'default',
    appearance: 'default',
  },
};

// =============================================
// Sizes Stories
// =============================================

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Button size="xs">XS Button</Button>
      <Button size="sm">SM Button</Button>
      <Button size="md">MD Button</Button>
      <Button size="lg">LG Button</Button>
      <Button size="xl">XL Button</Button>
    </div>
  ),
};

// =============================================
// Variants Stories
// =============================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="info">Info</Button>
    </div>
  ),
};

// =============================================
// Appearance Stories
// =============================================

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Appearances</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" appearance="default">Default (Filled)</Button>
          <Button variant="primary" appearance="ghost">Ghost (Bordered)</Button>
          <Button variant="primary" appearance="subtile">Subtile (Text Only)</Button>
        </div>
      </section>
    </div>
  ),
};

// =============================================
// States Stories
// =============================================

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Normal</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" active>Active</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
};

export const Active: Story = {
  args: {
    children: 'Active',
    variant: 'primary',
    active: true,
  },
};

export const Block: Story = {
  args: {
    children: 'Block Button (100% width)',
    variant: 'primary',
    block: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// =============================================
// Icons Stories
// =============================================

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" leftIcon={<SearchIcon />}>Search</Button>
      <Button variant="success" rightIcon={<ArrowRightIcon />}>Continue</Button>
      <Button variant="danger" leftIcon={<TrashIcon />}>Delete</Button>
      <Button variant="primary" leftIcon={<CheckIcon />} rightIcon={<ArrowRightIcon />}>
        Complete
      </Button>
    </div>
  ),
};

export const LeftIcon: Story = {
  args: {
    children: 'Search',
    variant: 'primary',
    leftIcon: <SearchIcon />,
  },
};

export const RightIcon: Story = {
  args: {
    children: 'Continue',
    variant: 'success',
    rightIcon: <ArrowRightIcon />,
  },
};

export const BothIcons: Story = {
  args: {
    children: 'Complete',
    variant: 'primary',
    leftIcon: <CheckIcon />,
    rightIcon: <ArrowRightIcon />,
  },
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button variant="primary" aria-label="Search">
        <SearchIcon />
      </Button>
      <Button variant="danger" aria-label="Delete">
        <TrashIcon />
      </Button>
      <Button variant="success" aria-label="Confirm">
        <CheckIcon />
      </Button>
    </div>
  ),
};

// =============================================
// Rounded Stories
// =============================================

export const RoundedVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Button rounded="none" variant="primary">Rounded None</Button>
      <Button rounded="sm" variant="primary">Rounded SM</Button>
      <Button rounded="md" variant="primary">Rounded MD</Button>
      <Button rounded="lg" variant="primary">Rounded LG</Button>
      <Button rounded="full" variant="primary">Rounded Full</Button>
    </div>
  ),
};

// =============================================
// Combinations Stories
// =============================================

export const SizeVariantMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ width: '30px', fontSize: '12px', color: '#666' }}>{size}</span>
          <Button size={size} variant="primary">Primary</Button>
          <Button size={size} variant="success">Success</Button>
          <Button size={size} variant="danger">Danger</Button>
        </div>
      ))}
    </div>
  ),
};

export const FullDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs">XS</Button>
          <Button size="sm">SM</Button>
          <Button size="md">MD</Button>
          <Button size="lg">LG</Button>
          <Button size="xl">XL</Button>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="info">Info</Button>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Appearances</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" appearance="default">Default (Filled)</Button>
          <Button variant="primary" appearance="ghost">Ghost</Button>
          <Button variant="primary" appearance="subtile">Subtile</Button>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>States</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" active>Active</Button>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" leftIcon={<SearchIcon />}>Search</Button>
          <Button variant="success" rightIcon={<ArrowRightIcon />}>Continue</Button>
          <Button variant="danger" leftIcon={<TrashIcon />}>Delete</Button>
          <Button variant="primary" aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </div>
      </section>
    </div>
  ),
};

// =============================================
// Animation Stories
// =============================================

export const AllAnimations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Button variant="primary" animation="swipe">Swipe</Button>
      <Button variant="primary" animation="diagonal-swipe">Diagonal Swipe</Button>
      <Button variant="primary" animation="double-swipe">Double Swipe</Button>
      <Button variant="primary" animation="diagonal-close">Diagonal Close</Button>
      <Button variant="primary" animation="zoning-in">Zoning In</Button>
      <Button variant="primary" animation="four-corners">4 Corners</Button>
      <Button variant="primary" animation="slice">Slice</Button>
      <Button variant="primary" animation="position-aware">Position Aware</Button>
      <Button variant="primary" animation="alternate">Alternate</Button>
      <Button variant="primary" animation="smoosh">Smoosh</Button>
      <Button variant="primary" animation="vertical-overlap">Vertical Overlap</Button>
      <Button variant="primary" animation="horizontal-overlap">Horizontal Overlap</Button>
      <Button variant="primary" animation="collision">Collision</Button>
      <Button variant="primary" animation="ripple">Ripple</Button>
    </div>
  ),
};

export const AnimationSwipe: Story = {
  args: {
    children: 'Swipe Animation',
    variant: 'primary',
    animation: 'swipe',
  },
};

export const AnimationDiagonal: Story = {
  args: {
    children: 'Diagonal Animation',
    variant: 'primary',
    animation: 'diagonal-swipe',
  },
};

export const AnimationDoubleSwipe: Story = {
  args: {
    children: 'Double Swipe',
    variant: 'primary',
    animation: 'double-swipe',
  },
};

export const AnimationCorners: Story = {
  args: {
    children: <span>4 Corners</span>,
    variant: 'primary',
    animation: 'four-corners',
  },
};

export const AnimationOverlapH: Story = {
  args: {
    children: <span>Horizontal Overlap</span>,
    variant: 'primary',
    animation: 'horizontal-overlap',
  },
};

export const AnimationOverlapV: Story = {
  args: {
    children: <span>Vertical Overlap</span>,
    variant: 'primary',
    animation: 'vertical-overlap',
  },
};

export const AnimationSlice: Story = {
  args: {
    children: 'Slice Animation',
    variant: 'primary',
    animation: 'slice',
  },
};

export const AnimationWithVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>swipe:</span>
        <Button variant="primary" animation="swipe">Primary</Button>
        <Button variant="success" animation="swipe">Success</Button>
        <Button variant="danger" animation="swipe">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>diagonal:</span>
        <Button variant="primary" animation="diagonal-swipe">Primary</Button>
        <Button variant="success" animation="diagonal-swipe">Success</Button>
        <Button variant="danger" animation="diagonal-swipe">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>corners:</span>
        <Button variant="primary" animation="four-corners"><span>Primary</span></Button>
        <Button variant="success" animation="four-corners"><span>Success</span></Button>
        <Button variant="danger" animation="four-corners"><span>Danger</span></Button>
      </div>
    </div>
  ),
};
