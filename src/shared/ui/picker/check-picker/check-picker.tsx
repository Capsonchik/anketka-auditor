'use client'

import React, { useState } from 'react';
import { BasePicker } from '../base-picker/base-picker';
import { BasePickerProps, PickerItem } from '../types';

export interface CheckPickerProps extends Omit<BasePickerProps<(string | number)[]>, 'onChange'> {
  onChange?: (value: (string | number)[]) => void;
}

export const CheckPicker: React.FC<CheckPickerProps> = (props) => {
  const { value: valueProp, defaultValue = [], onChange, ...rest } = props;

  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = (newValue: (string | number)[]) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSelect = (item: PickerItem) => {
    const currentValue = value || [];
    const nextValue = [...currentValue];
    const index = nextValue.findIndex(v => String(v) === String(item.value));

    if (index > -1) {
      nextValue.splice(index, 1);
    } else {
      nextValue.push(item.value);
    }

    handleChange(nextValue);
  };

  return (
    <BasePicker
      {...rest}
      value={value}
      onSelect={handleSelect}
      onChange={handleChange}
      multiple={true}
    />
  );
};
