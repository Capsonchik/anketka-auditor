import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollReveal } from './scroll-reveal';

const meta = {
  title: 'Shared/UI/ScrollReveal',
  component: ScrollReveal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Обертка ScrollReveal — компонент для анимации появления элементов при скролле.

## Основные возможности:
- **Разные типы анимации**: fade, slide-up, slide-down, slide-left, slide-right, scale.
- **Длительность и задержка**: Полный контроль через пропсы \`duration\` и \`delay\`.
- **Порог видимости (threshold)**: Настройка момента срабатывания анимации (от 0 до 1).
- **Отступы от экрана (rootMargin)**: Возможность задать в пикселях, на каком расстоянии от края экрана начнется анимация.
- **Однократное срабатывание (once)**: По умолчанию анимация срабатывает один раз при первом появлении.

## Использование
Оберните любой контент или другой компонент в \`ScrollReveal\`, чтобы добавить ему эффект появления.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale'],
      description: 'Тип анимации появления',
    },
    duration: {
      control: { type: 'number', min: 0, max: 5000, step: 100 },
      description: 'Длительность анимации в мс',
    },
    delay: {
      control: { type: 'number', min: 0, max: 5000, step: 100 },
      description: 'Задержка перед началом в мс',
    },
    threshold: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Порог видимости для срабатывания',
    },
    once: {
      control: 'boolean',
      description: 'Срабатывать только один раз',
    },
  },
  args: {
    children: <div>Scroll Reveal Content</div>,
    animation: 'slide-up',
    duration: 800,
    delay: 0,
    threshold: 0.1,
    once: true,
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Вспомогательный компонент-заглушка для демонстрации
const Box = ({ color, text }: { color: string; text: string }) => (
  <div style={{
    width: '300px',
    height: '200px',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0'
  }}>
    {text}
  </div>
);

// =============================================
// Базовая история
// =============================================
export const Default: Story = {
  render: (args) => (
    <div style={{ height: '150vh', paddingTop: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ marginBottom: '20px', color: '#666' }}>Проскролльте вниз, чтобы увидеть анимацию ↓</p>
      <ScrollReveal {...args} />
    </div>
  ),
  args: {
    animation: 'slide-up',
    duration: 800,
    children: <Box color="var(--primary-500)" text="Я появился!" />,
  },
};

// =============================================
// Несколько анимаций
// =============================================
export const MultipleAnimations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '100px 0' }}>
      <ScrollReveal animation="slide-left" duration={1000}>
        <Box color="#ff4d4f" text="Slide Left" />
      </ScrollReveal>
      
      <ScrollReveal animation="slide-right" duration={1000} delay={200}>
        <Box color="#52c41a" text="Slide Right (Delay 200ms)" />
      </ScrollReveal>
      
      <ScrollReveal animation="scale" duration={1200} delay={400}>
        <Box color="#1890ff" text="Scale Up (Delay 400ms)" />
      </ScrollReveal>

      <ScrollReveal animation="fade" duration={1500} delay={600}>
        <Box color="#722ed1" text="Fade In (Delay 600ms)" />
      </ScrollReveal>
    </div>
  ),
  args: {
    children: null, // Игнорируем в этой истории, так как всё внутри render
  },
};
