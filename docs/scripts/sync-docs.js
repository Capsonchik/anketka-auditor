const fs = require('fs');
const path = require('path');

const uiDir = path.resolve(__dirname, '../../src/shared/ui');
const docsDir = path.resolve(__dirname, '../docs/ui');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const components = fs.readdirSync(uiDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

components.forEach(component => {
  const storiesPath = path.join(uiDir, component, `${component}.stories.tsx`);
  if (fs.existsSync(storiesPath)) {
    const content = fs.readFileSync(storiesPath, 'utf-8');
    const titleLine = content.split('\n').find(line => line.includes('title:'));
    const title = titleLine ? titleLine.split('/').pop().replace(/\'|,/g, '') : component;

    const docContent = `---
sidebar_position: 1
---

# ${title}

Документация для компонента **${title}**.

## Пример использования

\`\`\`tsx
import { ${title} } from '@shared/ui';

const MyComponent = () => {
  return <${title} />;
};
\`\`\`
`;

    fs.writeFileSync(path.join(docsDir, `${component}.md`), docContent);
    console.log(`Generated docs for ${component}`);
  }
});
