# Карта проекта — auditor_frontend

Структура каталогов с кратким описанием каждого файла.
Путь указан относительно корня `auditor_frontend/`.

```
auditor_frontend/
├── index.ts                              # Баррель-экспорт модуля (entities, features, widgets, shared)
├── demo.html                             # Исходный статичный HTML-прототип кабинета (источник дизайна)
│
├── core/                                 # Слой инфраструктуры (FSD: app-уровень)
│   └── providers/
│       └── error-boundary-provider.tsx   # ErrorBoundaryProvider — классовый ErrorBoundary + fallback UI
│
├── entities/                             # Бизнес-сущности
│   ├── task/
│   │   ├── index.ts                      # Экспорт типов и моков task
│   │   └── model/
│   │       ├── types.ts                  # Task, TaskStatus, TaskFilter, DashboardMetrics
│   │       └── mock.ts                   # mockTasks, mockDashboardMetrics, filterTasks(), getTasksByStatus()
│   └── user/
│       ├── index.ts                      # Экспорт типов и моков user
│       └── model/
│           ├── types.ts                  # User
│           └── mock.ts                   # mockAuditor
│
├── features/                             # Композиционные блоки (бизнес-фичи)
│   ├── index.ts                          # Экспорт всех фич
│   ├── dashboard-stat-card/
│   │   ├── index.ts
│   │   └── ui/
│   │       ├── index.ts
│   │       ├── dashboard-stat-card.tsx   # Карточка метрики дашборда (title/value/desc, clickable, red)
│   │       └── dashboard-stat-card.module.scss
│   ├── task-card/
│   │   ├── index.ts
│   │   └── ui/
│   │       ├── index.ts
│   │       ├── task-card.tsx             # Карточка задания + кнопки действий по статусу
│   │       └── task-card.module.scss
│   ├── task-filters/
│   │   ├── index.ts
│   │   └── ui/
│   │       ├── index.ts
│   │       ├── task-filters.tsx          # Панель фильтров (текст + SelectPicker × 5 + кнопки)
│   │       └── task-filters.module.scss
│   └── welcome-metrics/
│       ├── index.ts
│       └── ui/
│           ├── index.ts
│           ├── welcome-metrics.tsx       # Приветствие + метрики (рейтинг/балл/баланс)
│           └── welcome-metrics.module.scss
│
├── widgets/                              # Крупные составные блоки
│   ├── index.ts                          # Экспорт AuditorHeader, AuditorNav
│   ├── auditor-header/
│   │   ├── index.ts
│   │   └── ui/
│   │       ├── index.ts
│   │       ├── auditor-header.tsx        # Шапка: логотип, юзер, тоггл оффлайн-режима
│   │       └── auditor-header.module.scss
│   └── auditor-nav/
│       ├── index.ts
│       └── ui/
│           ├── index.ts
│           ├── auditor-nav.tsx           # Нижняя навигация (5 пунктов, подсветка активного)
│           └── auditor-nav.module.scss
│
├── pages/                                # Страницы кабинета
│   ├── index.ts                          # Экспорт всех страниц
│   ├── dashboard/
│   │   ├── index.ts
│   │   ├── dashboard-page.tsx            # Главная: метрики + карточки + ближайшие задачи + уведомления
│   │   └── dashboard.module.scss
│   ├── tasks/
│   │   ├── index.ts
│   │   ├── tasks-page.tsx                # Список заданий с фильтрами и пустым состоянием
│   │   └── tasks.module.scss
│   ├── map/
│   │   ├── index.ts
│   │   ├── map-page.tsx                  # Имитация карты с маркерами + легенда
│   │   └── map.module.scss
│   ├── stats/
│   │   ├── index.ts
│   │   ├── stats-page.tsx                # Рейтинг, баланс, недельная статистика, история (таблица)
│   │   └── stats.module.scss
│   ├── profile/
│   │   ├── index.ts
│   │   ├── profile-page.tsx              # Данные аудитора, быстрые ссылки
│   │   └── profile.module.scss
│   ├── instructions/
│   │   ├── index.ts
│   │   ├── instructions-page.tsx         # Карточки инструкций (фото/чек-лист/легенда/ценофиксация)
│   │   └── instructions.module.scss
│   └── support/
│       ├── index.ts
│       ├── support-page.tsx              # Форма обратной связи + контакты
│       └── support.module.scss
│
└── shared/                               # Переиспользуемые ресурсы
    ├── index.ts                          # Экспорт lib + ui
    │
    ├── lib/
    │   ├── index.ts
    │   └── cn.ts                         # Утилита условных CSS-классов (замена clsx)
    │
    ├── hooks/
    │   └── use-click-outside.ts          # Хук клика вне элемента (для Picker)
    │
    ├── styles/                           # Глобальные SCSS-переменные и миксины
    │   ├── index.scss                    # Точка входа: @use variables + mixins
    │   ├── _variables.scss
    │   ├── _mixins.scss
    │   ├── variables/
    │   │   └── _colors.scss
    │   └── mixins/
    │       ├── index.scss
    │       ├── _fluid.scss
    │       ├── _ui.scss
    │       ├── _animations.scss
    │       └── _scrollbar.scss
    │
    └── ui/
        ├── index.ts                      # Экспорт PageContainer (остальные через подпапки)
        ├── page-container/
        │   ├── index.ts
        │   ├── page-container.tsx        # Обёртка-карточка для контента страницы
        │   └── page-container.module.scss
        ├── button/
        │   ├── index.ts
        │   ├── button.tsx                # Кнопка с 15 анимациями, ResizeObserver, position-aware
        │   ├── button.types.ts           # ButtonProps, ButtonSize/Variant/Appearance/Rounded/Animation
        │   ├── button.module.scss
        │   └── styles/
        │       ├── _variables.scss
        │       ├── mixins.scss
        │       ├── animations.module.scss # CSS для всех 15 анимаций
        │       ├── primary.module.scss
        │       ├── ghost.module.scss
        │       └── subtile.module.scss
        ├── picker/
        │   ├── index.ts                  # Экспорт Base/Select/Check + types
        │   ├── types.ts                  # PickerItem, BasePickerProps
        │   ├── base-picker/
        │   │   ├── base-picker.tsx       # Универсальный дропдаун: поиск, keyboard, hidden select
        │   │   └── base-picker.module.scss
        │   ├── select-picker/
        │   │   └── select-picker.tsx     # Одиночный выбор (обёртка над BasePicker)
        │   └── check-picker/
        │       └── check-picker.tsx      # Множественный выбор (обёртка над BasePicker)
        ├── modal/
        │   ├── index.ts
        │   ├── modal.tsx                 # Модалка через createPortal, backdrop static/shake
        │   ├── modal.types.ts            # (пустой — типы не вынесены)
        │   └── modal.module.scss
        └── error-fallback/
            ├── index.ts
            ├── error-fallback.tsx        # Fallback UI ошибки + модалка деталей стека
            └── error-fallback.module.scss
```

## Поток данных и зависимостей

```
demo.html (прототип)
   │  источник дизайна/логики
   ▼
pages/* ──────────► widgets/ ──────────► core/providers
   │                   │
   ├──► features/* ───► entities/* (типы + моки + селекторы)
   │        │
   │        └──► shared/ui (Button, Picker, Modal, PageContainer)
   │
   └──► shared/ui (PageContainer), shared/lib (cn)

Все слои могут использовать shared/* и core/*
entities не импортируют features/widgets/pages (FSD-правило)
```

## Маршруты (Next.js App Router, хост-приложение)

| Путь | Страница | Компонент |
|---|---|---|
| `/auditor` | Дашборд | `DashboardPage` |
| `/auditor/tasks` | Мои задания | `TasksPage` |
| `/auditor/map` | Карта заданий | `MapPage` |
| `/auditor/stats` | Эффективность | `StatsPage` |
| `/auditor/profile` | Профиль | `ProfilePage` |
| `/auditor/instructions` | Инструкции | `InstructionsPage` |
| `/auditor/support` | Поддержка | `SupportPage` |

## Сущности данных

### Task (entities/task)
Поля: `id, checkId, projectName, checkName, clientName, address, city, status, dueDate, dueTime, payment, legend, forbiddenDays, instructionsUrl, controllerComment, projectId, surveyId, surveyCategory`

Статусы: `assigned | in_progress | completed | overdue | free`

Функции: `filterTasks(tasks, filter)`, `getTasksByStatus(tasks, status)`

### User (entities/user)
Поля: `id, firstName, lastName, email, phone, rating, averageScore, balance, isOfflineMode`

### DashboardMetrics (entities/task)
Поля: `activeTasks, overdueTasks, freeChecks, completedToday, completedWeek, currentRating, averageScore, currentBalance`

## UI-кит кратко

| Компонент | Назначение | Ключевые особенности |
|---|---|---|
| `Button` | Кнопка | 5 размеров, 6 вариантов, 3 appearance, 15 анимаций, position-aware эффект, loading/active/block |
| `SelectPicker` | Одиночный выбор | Поиск, keyboard-навигация, cleanable, hidden `<select>` для форм |
| `CheckPicker` | Множественный выбор | Чекбоксы, toggle значений |
| `BasePicker` | База для Picker | Управление открытием, фильтром, ARIA |
| `Modal` | Модальное окно | Portal, backdrop (true/static/false), shake-анимация |
| `PageContainer` | Обёртка страницы | Карточка с белым фоном и тенью |
| `ErrorFallback` | UI ошибки | Заголовок/сообщение + модалка стека + кнопки действий |
| `ErrorBoundaryProvider` | ErrorBoundary | Классовый, getDerivedStateFromError, componentDidCatch, кастомный fallback |
