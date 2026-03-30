// @ts-check
// Примечание: Docusaurus v3 + TypeScript
// Подробнее: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BI Next App',
  tagline: 'Next.js приложение с FSD архитектурой',
  favicon: 'img/favicon.ico',

  url: 'https://your-domain.com',
  baseUrl: '/',
  organizationName: 'your-org',
  projectName: 'bi-next-app',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/your-org/bi-next-app/tree/main/docs/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'BI Next App',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              { label: 'Начало работы', to: '/intro' },
              { label: 'Архитектура', to: '/architecture/overview' },
              { label: 'Правила', to: '/rules/project' },
              { label: 'Стили', to: '/styles/overview' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BI Next App`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['typescript', 'scss', 'json'],
      },
    }),
};

export default config;
