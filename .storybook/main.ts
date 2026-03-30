import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '.'),
      ],
    });

    config.resolve = config.resolve || {};
    config.resolve.extensions = [
      ...(config.resolve.extensions || []),
      '.ts',
      '.tsx',
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@app': path.resolve(__dirname, '../src/app'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@widgets': path.resolve(__dirname, '../src/widgets'),
      '@features': path.resolve(__dirname, '../src/features'),
      '@entities': path.resolve(__dirname, '../src/entities'),
      '@shared': path.resolve(__dirname, '../src/shared'),
    };

    const srcPath = path.resolve(__dirname, '../src')
    const sharedStylesPath = path.resolve(__dirname, '../src/shared/styles')

    const sassAdditionalData = `
      @use "${path.resolve(__dirname, '../src/shared/styles/_prelude.scss').replace(/\\/g, '/')}" as *;
    `

    const mergeAdditionalData = (
      existing: unknown,
    ): string | ((content: string, loaderContext: unknown) => string) => {
      if (typeof existing === 'function') {
        return (content: string, loaderContext: unknown) =>
          sassAdditionalData + existing(content, loaderContext)
      }

      if (typeof existing === 'string') return sassAdditionalData + existing

      return sassAdditionalData
    }

    const normalizeIncludePaths = (maybePaths: unknown): string[] => {
      if (!maybePaths) return []
      if (Array.isArray(maybePaths)) return maybePaths.filter((p) => typeof p === 'string')
      if (typeof maybePaths === 'string') return [maybePaths]
      return []
    }

    const uniq = (items: string[]) => Array.from(new Set(items))

    const applySassLoaderOptions = (rules: unknown) => {
      if (!Array.isArray(rules)) return

      for (const rule of rules) {
        if (!rule || typeof rule !== 'object') continue

        const asAny = rule as any

        if (Array.isArray(asAny.oneOf)) applySassLoaderOptions(asAny.oneOf)
        if (Array.isArray(asAny.rules)) applySassLoaderOptions(asAny.rules)

        const use = asAny.use ?? asAny.loader

        const applyToUseEntry = (useEntry: any) => {
          if (!useEntry) return

          if (typeof useEntry === 'string') return

          if (useEntry.loader && String(useEntry.loader).includes('sass-loader')) {
            const existingOptions = useEntry.options || {}
            const existingSassOptions = existingOptions.sassOptions || {}

            useEntry.options = {
              ...existingOptions,
              additionalData: mergeAdditionalData(existingOptions.additionalData),
              sassOptions: {
                ...existingSassOptions,
                includePaths: uniq([
                  ...normalizeIncludePaths(existingSassOptions.includePaths),
                  srcPath,
                  sharedStylesPath,
                ]),
              },
            }
          }
        }

        if (Array.isArray(use)) {
          for (const useEntry of use) applyToUseEntry(useEntry)
        } else {
          applyToUseEntry(use)
        }
      }
    }

    /* applySassLoaderOptions(config.module.rules) */

    // CSS files handling
    const cssRule = config.module.rules.find((rule) => {
      if (typeof rule !== 'object') return false;
      const test = (rule as any).test;
      return test && test.toString().includes('css');
    });

    if (cssRule) {
      (cssRule as any).exclude = /\.css$/;
    }

    // Удаляем все существующие правила для scss, чтобы избежать конфликтов
    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule || typeof rule !== 'object') return true;
      const test = (rule as any).test;
      if (!test) return true;
      const testStr = test.toString();
      return !testStr.includes('scss') && !testStr.includes('sass');
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: [
        path.resolve(__dirname, '../src'),
      ],
      exclude: /node_modules/,
    })

    config.module.rules.unshift(
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                auto: true,
                exportLocalsConvention: 'asIs',
                namedExport: false,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
              esModule: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: sassAdditionalData,
              sassOptions: {
                includePaths: [srcPath, sharedStylesPath],
              },
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: sassAdditionalData,
              sassOptions: {
                includePaths: [srcPath, sharedStylesPath],
              },
            },
          },
        ],
        include: path.resolve(__dirname, '../src'),
      },
    )

    return config;
  },
};

export default config;
