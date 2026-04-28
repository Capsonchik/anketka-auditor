// shared/lib/validation/name-validation.ts
import * as yup from 'yup';

export interface NameValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  fieldName?: string;
  allowApostrophe?: boolean;
  allowSpace?: boolean;
}

export const createNameSchema = (options: NameValidationOptions = {}) => {
  const {
    required = false,
    minLength = 2,
    maxLength = 50,
    fieldName = 'Поле',
    allowApostrophe = false,
    allowSpace = false,
  } = options;

  let schema = yup.string();

  // 1. Проверка на обязательность
  if (required) {
    schema = schema.required(`${fieldName} обязательно для заполнения`);
  } else {
    schema = schema.transform((value) => (value === '' ? undefined : value));
  }

  // 2. Проверка на минимальную длину
  if (minLength > 0) {
    schema = schema.min(minLength, `${fieldName} должно содержать минимум ${minLength} символа(ов)`);
  }

  // 3. Проверка на максимальную длину
  if (maxLength > 0) {
    schema = schema.max(maxLength, `${fieldName} не должно превышать ${maxLength} символов`);
  }

  // 4. Проверка: только буквы и разрешенные разделители
  schema = schema.test(
    'only-letters-and-allowed-separators',
    `${fieldName} может содержать только буквы${allowApostrophe ? ', апостроф' : ''}${allowSpace ? ', пробел' : ''} и дефис. Цифры и другие символы запрещены`,
    (value) => {
      if (!value) return !required;
      
      // Разрешенные символы
      let allowedChars = 'A-Za-zА-Яа-яёЁ-';
      if (allowApostrophe) allowedChars += "'";
      if (allowSpace) allowedChars += ' ';
      
      const regex = new RegExp(`^[${allowedChars}]+$`);
      return regex.test(value);
    }
  );

  // 5. Проверка: дефис не в начале
  schema = schema.test(
    'hyphen-not-at-start',
    `${fieldName} не может начинаться с дефиса`,
    (value) => {
      if (!value) return !required;
      return !value.startsWith('-');
    }
  );

  // 6. Проверка: дефис не в конце
  schema = schema.test(
    'hyphen-not-at-end',
    `${fieldName} не может заканчиваться дефисом`,
    (value) => {
      if (!value) return !required;
      return !value.endsWith('-');
    }
  );

  // 7. Проверка: нет двух дефисов подряд
  schema = schema.test(
    'no-consecutive-hyphens',
    `${fieldName} не может содержать два дефиса подряд`,
    (value) => {
      if (!value) return !required;
      return !value.includes('--');
    }
  );

  // 8. Проверка: апостроф не в начале (если разрешен)
  if (allowApostrophe) {
    schema = schema.test(
      'apostrophe-not-at-start',
      `${fieldName} не может начинаться с апострофа`,
      (value) => {
        if (!value) return !required;
        return !value.startsWith("'");
      }
    );

    schema = schema.test(
      'apostrophe-not-at-end',
      `${fieldName} не может заканчиваться апострофом`,
      (value) => {
        if (!value) return !required;
        return !value.endsWith("'");
      }
    );
  } else {
    // 9. Проверка: апостроф запрещен полностью
    schema = schema.test(
      'no-apostrophe',
      `${fieldName} не может содержать апостроф`,
      (value) => {
        if (!value) return !required;
        return !value.includes("'");
      }
    );
  }

  // 10. Проверка: пробелы (если разрешены)
  if (allowSpace) {
    schema = schema.test(
      'space-not-at-start',
      `${fieldName} не может начинаться с пробела`,
      (value) => {
        if (!value) return !required;
        return !value.startsWith(' ');
      }
    );

    schema = schema.test(
      'space-not-at-end',
      `${fieldName} не может заканчиваться пробелом`,
      (value) => {
        if (!value) return !required;
        return !value.endsWith(' ');
      }
    );

    schema = schema.test(
      'no-consecutive-spaces',
      `${fieldName} не может содержать два пробела подряд`,
      (value) => {
        if (!value) return !required;
        return !value.includes('  ');
      }
    );
  } else {
    // 11. Проверка: пробелы запрещены
    schema = schema.test(
      'no-spaces',
      `${fieldName} не может содержать пробелы`,
      (value) => {
        if (!value) return !required;
        return !value.includes(' ');
      }
    );
  }

  return schema;
};

// Предустановленные схемы
export const nameSchemas = {
  lastName: () => createNameSchema({
    required: true,
    minLength: 2,
    maxLength: 50,
    fieldName: 'Фамилия',
  }),
  
  firstName: () => createNameSchema({
    required: true,
    minLength: 2,
    maxLength: 30,
    fieldName: 'Имя',
  }),
  
  middleName: () => createNameSchema({
    required: false,
    minLength: 2,
    maxLength: 50,
    fieldName: 'Отчество',
  }),
  
  firstNameWithApostrophe: () => createNameSchema({
    required: true,
    minLength: 2,
    maxLength: 50,
    fieldName: 'Имя',
    allowApostrophe: true,
  }),
  
  fullNameWithSpaces: () => createNameSchema({
    required: true,
    minLength: 2,
    maxLength: 100,
    fieldName: 'Полное имя',
    allowApostrophe: true,
    allowSpace: true,
  }),
};