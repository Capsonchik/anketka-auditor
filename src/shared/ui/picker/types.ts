import React from 'react';

export interface PickerItem {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  group?: string;
  [key: string]: any;
}

export interface BasePickerProps<V> {
  data: PickerItem[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  cleanable?: boolean;
  searchable?: boolean;
  block?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: string | boolean;
  
  // Custom renderers
  renderMenuItem?: (label: React.ReactNode, item: PickerItem) => React.ReactNode;
  renderValue?: (value: V, item: PickerItem | PickerItem[] | null) => React.ReactNode;
  renderExtraFooter?: () => React.ReactNode;
  
  // Accessibility & Form
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  tabIndex?: number;
}
