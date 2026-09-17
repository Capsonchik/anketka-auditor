# Анализ: паритет заполнения проверки с Public PA (`/pa`)

**Ветки (рабочие):**
- фронт: `feature/check-survey-pa-parity` → `d:\anketa\auditor_frontend`
- бэк (монорепо): `feature/check-survey-pa-parity` → `d:\anketa\anketka`  
  *(эндпоинты Public PA **не меняем**; ветка бэка — на случай аддитивных правок/тестов позже)*

**Эталон (как должно работать):**
- UI: [`https://survey-all.ru/pa?token=…&checkId=…`](https://survey-all.ru/pa?token=ffb58dac-d59d-43d4-8fea-ff5259a261a0&checkId=f73b133b-eebe-45ea-997a-b650ea8c775a)
- код: `d:\anketa\anketka\src\app\(anketa-screen)\pa` → `pages-fsd/pa`

**Целевая страница кабинета:**
- [`https://auditor.survey-all.ru/auditor/assignments/{checkId}`](https://auditor.survey-all.ru/auditor/assignments/f73b133b-eebe-45ea-997a-b650ea8c775a)
- код: `auditor_frontend` → `assignments/[checkId]` + `features/check-survey`

**Ограничения:**
1. Текущие эндпоинты бэка **не модифицировать** (контракты Public PA и auditor portal остаются).
2. На фронте кабинета — **наш `shared`** (Input, SelectPicker, FormField, Button, ProgressBar и т.д.), без переноса rsuite из anketka.
3. Сначала анализ (этот файл), затем поэтапный порт логики.

**Статус документа:** анализ готов; реализация MVP паритета начата в ветке `feature/check-survey-pa-parity` (wizard, continue/finish, options, cascade libs).

---

## 1. Зачем это нужно

В кабинете аудитора уже есть обвязка:
- accept назначения;
- `GET` одной проверки + `inviteToken`;
- вызовы Public PA (`GET /pa/{token}`, draft с `checkId`, submit с `context.checkId`);
- блокировка после `completed` / `passed`.

Но **логика заполнения** упрощена до «плоского» списка полей и одного `mode: finish`.  
В эталонном `/pa` — полноценный продуктный флоу: страницы, loop, continue/finish, каскадные options, skipCompletedInLoop, show/terminate logic, богатые типы вопросов.

Нужно, чтобы страница задания в кабинете вела себя **как `/pa`**, оставаясь внутри UX кабинета (VisitMeta, shared UI, auth).

---

## 2. Эталон: как устроен `/pa`

### 2.1. Точка входа

| Слой | Путь |
|------|------|
| App Router | `anketka/src/app/(anketa-screen)/pa/page.tsx` |
| Страница | `anketka/src/pages-fsd/pa/ui/PaPage.tsx` |
| Чистая логика | `pages-fsd/pa/lib/surveyLogic.ts`, `cascadeCompletion.ts`, `buildPaOptionsRequestParams.ts` |

**Query:**
- `token` — обязательный invite UUID;
- `checkId` — опциональный UUID проверки (на submit уходит в `context.checkId`).

### 2.2. Загрузка данных (последовательность)

1. `GET /api/v1/public/pa/{token}` — схема (builder.pages, вопросы, options статичные, `sectionType`, `loopConfig`, `logic`, `config`).
2. `GET /api/v1/public/pa/{token}/draft` — черновик (`pageIdx`, `answers`, `completedValuesByCode`, `completion`).  
   *В эталоне `checkId` в query draft **не передаётся** (в кабинете уже передаём — это лучше, сохраняем).*
3. Для вопросов с `config.source` — `GET /api/v1/public/pa/{token}/options?...` (каскадные фильтры из ответов).
4. Автосейв draft (~350 ms) + offline-кэш (schema/options/outbox) — в кабинете можно отложить.

### 2.3. Модель ответов

**В памяти UI:** плоский `Record<code, value>` (`code` → `config.code` → `id`).

**Submit на loop-странице:**
```json
{
  "mode": "continue" | "finish",
  "answers": {
    "screening": { "...": "..." },
    "product": { "...": "..." }
  },
  "context": { "checkId": "<uuid>" }
}
```

**Submit без loop:** плоский `answers` + `mode: finish` + опциональный `context`.

**Draft payload (эталон):**
```ts
{
  pageIdx: number
  answers: Record<string, unknown>
  submittedCount: number
  completedValuesByCode: Record<string, string[]>
  savedAt: string
  // сервер может добавить:
  completion?: { itemsCompleted, itemsTotal, allCompleted }
}
```

Бэкенд уже умеет оба формата answers (flat и `{ screening, product }`) и мержит submitted по `checkId` в draft.

### 2.4. Loop / continue / completedValues

- Страницы: wizard (`pageIdx`, Назад / Далее).
- `sectionType === 'loop'` (или fallback по title) — кнопки:
  - **Отправить и продолжить** → `mode: continue`;
  - **Отправить и завершить** → `mode: finish`.
- После `continue`: очистить только answers loop-страницы; screening оставить; обновить `completedValuesByCode` для вопросов с `config.skipCompletedInLoop`.
- Ключ completed: `buildCompletedOptionKey` (с учётом cascade filters: `parent=val|…|__value=option`).
- Options с уже пройденными значениями скрываются; если всё скрыто и `completion.allCompleted` — fallback «показать полный список».

### 2.5. Логика показа / терминации

`surveyLogic.ts`:
- `isQuestionVisibleByLogic(question, answers)` — дерево `logic` (condition/group);
- `shouldTerminateByLogic` — блокирует «Далее» при terminate-условии.

### 2.6. Каскадные справочники

- `config.filters: [{ fromQuestionCode, targetColumn }]` → `filtersJson` в options.
- Смена driver-ответа чистит зависимые answers и кэш options.
- Legacy depends: `ref_cities`→`region`, checklist brands/products и т.д. (`getDependsOnCodes` / `buildPaOptionsRequestParams`).

### 2.7. Типы вопросов (матрица эталона)

| type | Поведение |
|------|-----------|
| intro | текст |
| boolean | checkbox |
| date / datetime | дата |
| select / single_choice | select + dynamic options + skip completed |
| multi_choice | чекбоксы, exclusive/NA |
| rank | порядок |
| photo | файлы (в эталоне — имена) |
| number / money | число |
| text / short_text / long_text / email / phone | текст |
| scale / nps | шкала |
| matrix | таблица (radio/checkbox/text/number) |

Плюс rotation options, скрытие identity-кодов (`auditorName` / `Phone` / `Email`).

### 2.8. Используемые Public PA эндпоинты (уже есть, не трогаем)

| Method | Path | Нужен в кабинете |
|--------|------|------------------|
| GET | `/pa/{token}` | да (есть) |
| GET | `/pa/{token}/draft?checkId=` | да (есть) |
| PUT/POST | `/pa/{token}/draft` | да (есть, расширить payload) |
| POST | `/pa/{token}/submit` | да (есть, добавить `continue` + nested answers) |
| GET | `/pa/{token}/options` | **да, на фронте кабинета ещё нет** |
| GET | `/pa/{token}/offline-bundle` | позже (опционально) |

---

## 3. Что есть сейчас в кабинете

| Область | Состояние |
|---------|-----------|
| Entry | `/auditor/assignments/[checkId]` + accept |
| Schema / draft / submit | RTK `entities/public-pa` |
| Форма | `features/check-survey` — все страницы сразу, ответы только `string` |
| Submit | только `mode: finish`, плоский answers |
| Options API | нет |
| Loop / continue | нет |
| `completedValuesByCode` | игнорируется при hydrate |
| Logic show/terminate | нет (поля `logic` нет в типах) |
| Типы | text / choice / number / textarea |
| UI | shared уже подключён |
| После отправки | readonly + блок «уже отправлена» (сохранить) |

---

## 4. Разрыв (gaps) — что нужно для паритета

Приоритет для ЦМ / loop-анкет (как «Лента ЦМ»):

1. **Wizard по страницам** + действия loop (`continue` / `finish`).
2. **Nested submit** `{ screening, product }` на loop.
3. **`completedValuesByCode`** из draft + обновление после continue; скрытие пройденных options.
4. **`GET .../options`** + каскад filters / clear dependents.
5. **Типизированные answers** (`unknown`, не только string) + корректный flatten при просмотре submitted.
6. **Расширение типов** `PublicPaQuestion` / page: `logic`, `loopConfig`, option flags (`isExclusive`, `isNA`), `display`.
7. **Рендер типов вопросов** на shared (минимум: select/single/multi + dynamic options; затем date, boolean, scale/nps, matrix, photo…).
8. **surveyLogic** (visible / terminate).
9. Счётчик прогресса loop (`completion` / «Осталось N · Отправлено M»).
10. (Позже) autosave draft payload как в PA; offline — вне MVP паритета.

**Не копировать:** rsuite, оффлайн SW/outbox as-is, публичный layout `/pa` — только логику и контракты.

---

## 5. План модулей во фронте (FSD)

```
entities/public-pa/
  model/types.ts                 # расширить типы builder/draft/completion
  api/public-pa.api.ts           # + getPublicPaOptions
  lib/…                          # questionAnswerKey, flatten answers

features/check-survey/           # эволюция (или pa-fill внутри)
  lib/
    survey-logic.ts              # порт pages-fsd/pa/lib/surveyLogic.ts
    cascade-completion.ts        # порт cascadeCompletion.ts (+ тесты)
    build-pa-options-params.ts   # порт buildPaOptionsRequestParams.ts
    answer-model.ts              # flat ↔ screening/product; draft extract
  hooks/
    use-pa-session.ts
    use-pa-options.ts
    use-pa-submit.ts             # continue/finish
  ui/
    check-survey-form.tsx        # оркестратор wizard
    question-field.tsx / fields/ # типы на shared
    loop-actions.tsx
    visit-meta.tsx               # оставить

app/.../assignments/[checkId]/page.tsx
  # accept + token/checkId → feature (без смены URL кабинета)
```

Чистые lib-файлы из anketka можно переносить почти 1:1 (без UI).

---

## 6. Бэкенд

**В рамках паритета логики заполнения — изменения API не требуются.**

Существующие Public PA уже:
- принимают `context.checkId`;
- поддерживают `mode: continue | finish`;
- считают `completedValuesByCode` / `completion`;
- отдают options по source/filters;
- мержат submitted answers в draft по `checkId`.

Ветка `feature/check-survey-pa-parity` на бэке — запасная (тесты, документация, только аддитив при необходимости).  
**Запрещено:** ломать контракты текущих эндпоинтов.

Кабинетные эндпоинты (`GET /auditor/assignments/{checkId}` и т.д.) остаются как есть.

---

## 7. Порядок реализации (после анализа)

1. Расширить типы + `getPublicPaOptions` в `entities/public-pa`.
2. Порт `surveyLogic` / `cascadeCompletion` / `buildPaOptionsParams` (+ unit-тесты cascade).
3. Answer model + restore `completedValuesByCode` / `completion` из draft.
4. Wizard + loop actions (`continue`/`finish`) с nested answers.
5. Question renderer: choice + dynamic options (каскад) на shared.
6. Logic visibility/terminate.
7. Остальные типы вопросов по приоритету продукта.
8. Подтянуть прогресс-счётчик loop в UI рядом с VisitMeta.
9. Регрессия: просмотр уже отправленной проверки (readonly + answers секций 1/2).

Критерий готовности MVP: одна и та же проверка (`checkId` + token) заполняется в кабинете с тем же результатом на бэке, что и через `/pa` (continue по товарам, skip completed, finish → `passed`).

---

## 8. Источники (ключевые файлы)

**Эталон anketka**
- `src/app/(anketa-screen)/pa/page.tsx`
- `src/pages-fsd/pa/ui/PaPage.tsx`
- `src/pages-fsd/pa/lib/surveyLogic.ts`
- `src/pages-fsd/pa/lib/cascadeCompletion.ts`
- `src/pages-fsd/pa/lib/buildPaOptionsRequestParams.ts`
- `backend/app/api/routes/public_pa.py`

**Кабинет auditor_frontend**
- `src/app/(private)/auditor/assignments/[checkId]/page.tsx`
- `src/features/check-survey/**`
- `src/entities/public-pa/**`

**Связанный прошлый анализ**
- `docs/check-survey/01-backend-frontend-analysis.md`
