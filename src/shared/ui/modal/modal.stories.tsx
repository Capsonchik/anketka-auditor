import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './modal';
import { Button } from '@shared/ui/button';

const meta = {
  title: 'Shared/UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Модальное окно — универсальный компонент для вывода важной информации, подтверждения действий или сбора данных.

## Основные возможности:
- **Управление подложкой (backdrop)**: true, false, 'static' (запрещает закрытие по клику вне окна).
- **Размеры**: xs, sm, md, lg, full.
- **Анимация запрета**: При backdrop='static' клик вне окна вызывает визуальный эффект "тряски".
- **Центрирование**: Окно может быть отцентрировано по вертикали или выровнено по верхнему краю.
- **Порталы**: Окно рендерится в body документа.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backdrop: {
      control: 'select',
      options: [true, false, 'static'],
      description: 'Поведение подложки',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'full'],
      description: 'Размер окна',
    },
    centered: {
      control: 'boolean',
      description: 'Центрирование по вертикали',
    },
    isOpen: {
      control: 'boolean',
      description: 'Состояние открытия',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================
// Базовая история
// =============================================
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть модальное окно</Button>
        <Modal 
          {...args} 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
        >
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px' }}>Заголовок модалки</h2>
            <p>Это пример базового модального окна. Вы можете нажать на подложку или на кнопку закрытия (если она есть внутри).</p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  args: {
    backdrop: true,
    size: 'md',
    centered: true,
  },
};

// =============================================
// Статическая подложка
// =============================================
export const StaticBackdrop: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть (static backdrop)</Button>
        <Modal 
          {...args} 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
        >
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '16px' }}>Внимание!</h2>
            <p>Это окно нельзя закрыть кликом по подложке. Попробуйте кликнуть вне окна — вы увидите анимацию "тряски".</p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="danger" onClick={() => setIsOpen(false)}>Понятно</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  args: {
    backdrop: 'static',
    size: 'sm',
  },
};

// =============================================
// Размеры
// =============================================
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'full' | null>(null);

    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        {(['xs', 'sm', 'md', 'lg', 'full'] as const).map((s) => (
          <Button key={s} onClick={() => setSize(s)}>
            Open {s.toUpperCase()}
          </Button>
        ))}
        <Modal 
          isOpen={!!size} 
          size={size || 'md'} 
          onClose={() => setSize(null)}
        >
          <div style={{ padding: '20px' }}>
            <h2>Размер: {size?.toUpperCase()}</h2>
            <p>Ширина модального окна адаптируется под выбранный параметр.</p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setSize(null)}>Закрыть</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
