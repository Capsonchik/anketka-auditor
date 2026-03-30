const fs = require('fs');
const path = require('path');
const translate = require('translate-google-api');

// Пути к файлам переводов
const RU_PATH = path.join(__dirname, '../messages/ru.json');
const EN_PATH = path.join(__dirname, '../messages/en.json');

// Читаем файлы
const ru = JSON.parse(fs.readFileSync(RU_PATH, 'utf8'));
let en = {};
if (fs.existsSync(EN_PATH)) {
  en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
}

async function main() {
  let updatedCount = 0;

  for (const key in ru) {
    const ruValue = ru[key];
    const enValue = en[key];

    // Переводим, если ключа нет, он пустой или имеет старый префикс
    const needsTranslation = !enValue || enValue === '' || enValue.startsWith('[EN]');

    if (needsTranslation) {
      try {
        // Сохраняем пробелы по краям
        const leadingSpaces = ruValue.match(/^\s*/)[0];
        const trailingSpaces = ruValue.match(/\s*$/)[0];
        const cleanText = ruValue.trim();

        if (!cleanText) {
            en[key] = ruValue; // Если там только пробелы - оставляем как есть
            continue;
        }

        console.log(`Translating: "${cleanText}"...`);
        const result = await translate(cleanText, {
          tld: "com",
          from: "ru",
          to: "en",
        });
        
        const translatedText = Array.isArray(result) ? result[0] : result;
        
        // Возвращаем пробелы на место
        en[key] = leadingSpaces + translatedText + trailingSpaces;
        updatedCount++;
        
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error(`Error translating "${ruValue}":`, err.message);
      }
    }
  }

  // Сохраняем результат
  fs.writeFileSync(EN_PATH, JSON.stringify(en, null, 2), 'utf8');
  console.log(`✅ Готово! Обновлено ключей: ${updatedCount}`);
}

main();
