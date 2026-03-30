module.exports = {
  locales: ['ru', 'en'],
  output: 'messages/$LOCALE.json',
  input: ['src/**/*.{ts,tsx}'],
  defaultValue: (locale, namespace, key) => {
    return locale === 'ru' ? key : ''; // По умолчанию в RU пишем сам ключ, в EN пусто (для перевода)
  },
  keySeparator: false,
  namespaceSeparator: false,
  sort: true,
  useKeysAsDefaultValue: true,
  createOldCatalogs: false,
};
