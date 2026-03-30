'use client'



import React, { useState } from 'react';
import { BasePicker } from '../base-picker/base-picker';
import { PickerItem } from '../types';

export interface SelectPickerProps {
  value?: string | number | null;
  defaultValue?: string | number | null;
  onChange?: (value: string | number | null) => void;
  onSelect?: (item: PickerItem) => void;
  items?: PickerItem[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  [key: string]: unknown;
}

export const SelectPicker: React.FC<SelectPickerProps> = (props) => {
  const { value: valueProp, defaultValue, onChange, ...rest } = props;

  const [internalValue, setInternalValue] = useState<string | number | undefined | null>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = (newValue: string | number | null) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSelect = (item: PickerItem) => {
    handleChange(item.value);
  };

  return (
    <BasePicker<string | number>
      {...rest as any}
      value={value as string | number | undefined}
      onSelect={handleSelect}
      onChange={handleChange}
      multiple={false}
    />
  );
};
