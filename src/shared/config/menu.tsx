import React from 'react'
import { 
  MarketIcon, 
  SummaryIcon, 
  ProjectsListIcon, 
  PaymentIcon, 
  DemographyIcon, 
  ProductIcon, 
  FolderIcon, 
  ResetIcon 
} from '@/shared/icons'

export interface MenuItemConfig {
  id: string
  label: string
  route?: string
  icon?: React.ReactNode
  items?: MenuItemConfig[]
  isGroup?: boolean
  hidden?: boolean
}

export const MENU_CONFIG: MenuItemConfig[] = [
  {
    id: 'home',
    label: 'Главная',
    route: '/',
    icon: <MarketIcon width={20} height={20} />,
    items: [
      {
        id: 'home-sections',
        label: 'Разделы',
        isGroup: true,
        items: [
          {
            id: 'hero',
            label: 'О продукте',
            route: '/#hero',
            icon: <SummaryIcon width={18} height={18} />,
          },
          {
            id: 'solutions-anchor',
            label: 'Инструменты',
            route: '/#solutions',
            icon: <ProjectsListIcon width={18} height={18} />,
          },
          {
            id: 'features',
            label: 'Преимущества',
            route: '/#features',
            icon: <PaymentIcon width={18} height={18} />,
          },
          {
            id: 'methodology',
            label: 'Методология',
            route: '/#methodology',
            icon: <DemographyIcon width={18} height={18} />,
          }
        ]
      }
    ]
  },
  {
    id: 'solutions',
    label: 'Решения',
    icon: <ProductIcon width={20} height={20} />,
    items: [
      {
        id: 'products',
        label: 'Продукты',
        isGroup: true,
        items: [
          {
            id: 'category-reports',
            label: 'Готовые категорийные отчеты',
            route: '/category-reports',
            icon: <FolderIcon width={18} height={18} />,
          },
          {
            id: 'solutions-builder',
            label: 'Конструктор аналитики',
            route: '/solutions-builder',
            icon: <ResetIcon width={18} height={18} />,
          }
        ]
      }
    ]
  }
]
