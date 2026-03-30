// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Архитектура',
      collapsed: true,
      items: ['architecture/overview'],
    },
    {
      type: 'category',
      label: 'Правила',
      collapsed: true,
      items: ['rules/project'],
    },
    {
      type: 'category',
      label: 'UI компоненты',
      collapsed: false,
      items: [
        'ui/button',
        'ui/input',
        'ui/phone-input',
        'ui/pill-switch-flexible',
        'ui/logo',
      ],
    },
    {
      type: 'category',
      label: 'Фичи',
      collapsed: false,
      items: [
        'features/theming',
      ],
    },
    {
      type: 'category',
      label: 'Стили',
      collapsed: true,
      items: ['styles/overview'],
    },
  ],
};

export default sidebars;
