# Анализ типов вопросов: `single_choice` vs «просто single»

**Репозиторий:** `d:\anketa\anketka\backend`  
**Дата:** 2026-09-21  
**Код не менялся** — только анализ.

---

## Короткий вывод

| Вопрос | Ответ |
|--------|--------|
| Есть ли на бэке тип `single`? | **Нет.** В БД/API/сервисах литерала `single` как типа вопроса нет. |
| Канон одиночного выбора (mystery/builder)? | **`single_choice`** |
| Legacy одиночного выбора (ЦМ / шаблоны)? | **`select`** |
| Что обычно имеют в виду под «просто single»? | Либо UI-ярлык «Одиночный» → `single_choice`, либо путаница с Accordion `type="single"`, либо legacy **`select`**. |

**Унифицировать имеет смысл пару `select` ↔ `single_choice`, а не `single` ↔ `single_choice`.**

---

## 1. Как тип хранится на бэке

- Модель: `app/models/survey_question.py` — поле `type: String(48)`, **без ENUM / CHECK**.
- API create: `type: str` (длина 1–48), **whitelist нет** — в БД можно записать любой тип.
- Наружу (builder / public PA) тип уходит **as-is** (`type=q.type`).
- Update вопроса часто **не меняет** `type` (тип задаётся при создании).

Итог: бэкенд — хранилище строк; семантика размазана по scoring, шаблонам, Excel-import и фронтам.

---

## 2. Типы, которые реально встречаются в бэкенде

### Явно используются в логике

| Тип | Где | Назначение |
|-----|-----|------------|
| `single_choice` | `app/services/scoring.py` | Один ответ (string), балл = `option.points`, NA обнуляет |
| `multi_choice` | `scoring.py` | Ответ list, exclusive / sum points |
| `short_text`, `long_text`, `number`, `email`, `date`, `time`, `rank`, `scale`, `photo` | `scoring.py` | Заполненность → `weight` |
| `select` | `surveys.py` apply-template (ЦМ), Excel-import options | Одиночный select + `config.source` / cascade |
| `multiselect`, `radio`, `checkbox` | Excel-import (парсинг колонки answers → options) | Legacy-имена при импорте |
| `boolean`, `money`, `intro`, `datetime`, `text` | Шаблоны ЦМ / full | Не choice-scoring |
| `project_point_picker`, `price_grid` | Quick/ЦМ шаблоны | Спец-UI |

### Opaque (бэк не интерпретирует)

Любой `payload.type` при create может лежать в БД. Фронт может писать/читать `matrix`, `cascade` (на create часто мапится), `nps` → на API часто уже `scale`, и т.д.

### Маппинг на фронте builder (`anketka`)

В `SurveyPage.tsx` при создании:

- UI `cascade` → API **`single_choice`**
- UI `nps` → API **`scale`**

Лейбл в списке секций: `single_choice: 'Одиночный'` — отсюда ощущение «просто single».

---

## 3. `single_choice` — поведение на бэке

**Файл:** `app/services/scoring.py`

1. **Max score:** `max(max(option.points без NA), question.weight)`.
2. **Ответ:** ожидается **строка** (value опции).
3. **Балл:** `opt.points`; если `is_na` → `(0, 0)` для процента.
4. Тесты: `tests/test_scoring.py`, фикстура в `tests/conftest.py`.

**Не используется** в:

- загрузке options / cascade (`config.source`, filters — type не смотрят);
- loop (`section_type` страницы);
- public PA serialize (passthrough);
- Excel-import set для парсинга answers (**там только** `select|multiselect|radio|checkbox`).

---

## 4. «Просто single» — что это на самом деле

### 4.1. Типа вопроса `single` на бэке нет

Поиск по `backend/app` + тесты: нет `type='single'`, нет ветки `== 'single'`.

### 4.2. Ближайший аналог — `select` (legacy ЦМ)

| Аспект | `single_choice` | `select` |
|--------|-----------------|----------|
| Builder mystery | Да (кнопка «Одиночный выбор») | Нет |
| Шаблоны ЦМ (`apply-template`) | Нет | **Да** (`type='select'` + sources) |
| Scoring по `option.points` / NA | **Да** | **Нет** → fallback: есть ответ → `weight` |
| Excel: answers → options | Нет (не в set) | **Да** |
| PA UI (`PaPage`, кабинет аудитора) | SelectPicker | Тот же путь (`select \|\| single_choice`) |

На UI PA они **выглядят одинаково**. На бэке в **scoring и import** — разное поведение.

### 4.3. Не путать с Accordion

В `auditor_frontend` `AccordionType = 'single' | 'multiple'` — это UI компонента, **не** тип вопроса анкеты.

---

## 5. Где фронты уже склеивают типы

| Проект | Место | Логика |
|--------|-------|--------|
| `anketka` PA | `PaPage.tsx` | `select \|\| single_choice` → один UI |
| `anketka` builder | Simulator, QuestionEditor | `single_choice \|\| select` |
| `anketka` revision | `RevisionQuestionInput` | `select \|\| single_choice` |
| `auditor_frontend` | `question-field.tsx` | `select \|\| single_choice \|\| dropdown` → choiceUi `'select'` |

Пока dual-check жив, удаление одного литерала из БД без миграции фронтов ломает отображение.

---

## 6. Что изменится, если привести к одному типу

Канон: **`single_choice`** (как scoring + builder).

### 6.1. Только alias в коде (низкий риск)

В `scoring.py`: обрабатывать `select` как `single_choice`.  
В Excel-import: добавить `single_choice` в set парсинга options.  
Шаблоны постепенно писать `single_choice`.

- Данные в БД не трогаем.
- Scoring для старых `select` **может измениться** (points вместо weight) — осознанное решение.

### 6.2. Миграция БД `select` → `single_choice` (средний риск)

```sql
-- концептуально
UPDATE survey_question SET type = 'single_choice' WHERE type = 'select';
```

**Что может сломаться без подготовки:**

| Риск | Почему |
|------|--------|
| Scoring ЦМ-анкет | Вопросы с `select` начнут брать `option.points` (часто 0 у справочников) вместо `weight` → **проценты/баллы съедут** |
| Excel import | Пока в set нет `single_choice`, импорт опций из answers перестанет создавать options для новых файлов с типом `single_choice` (если шаблоны уже пишут его) |
| Старые клиенты / отчёты | Фильтры `WHERE type = 'select'` перестанут находить строки |
| Фронт без dual-check | Если где-то остался только `=== 'select'`, поля пропадут |
| Симулятор / ревизия | Нужно убедиться, что везде `single_choice` или dual |

**Что обычно не ломается:**

- Форма ответов attempt (value опции — те же строки).
- Cascade / options API (смотрят `config`, не `type`).
- Loop / completedValues (по code, не по type).

### 6.3. Вводить новый короткий тип `single` (не рекомендуется)

- Добавит **третий** литерал рядом с `select` и `single_choice`.
- Потребует правок scoring, builder, PA, Excel, миграции.
- Нет выигрыша против канона `single_choice`.

---

## 7. Рекомендация

1. **Не искать/не вводить `single`** как тип вопроса — его нет; «Одиночный» в UI = `single_choice`.
2. Считать **`select` legacy-алиасом** `single_choice`.
3. Безопасный порядок:
   1. Alias в scoring (+ import set);
   2. Шаблоны ЦМ → писать `single_choice`;
   3. Audit БД: сколько строк с `type='select'`, есть ли `weight`/`points`;
   4. One-shot migration `select` → `single_choice`;
   5. Убрать dual-check на фронтах (`PaPage`, `question-field`, revision, simulator).
4. **`multi_choice` / `multiselect` не смешивать** в той же волне (другой shape ответа: list vs string).

---

## 8. Карта файлов (бэкенд)

| Файл | Роль |
|------|------|
| `app/models/survey_question.py` | `type` как свободная строка |
| `app/services/scoring.py` | Единственная жёсткая семантика `single_choice` / `multi_choice` |
| `app/api/routes/surveys.py` | Excel-import set; apply-template `type='select'` |
| `app/api/routes/public_pa.py` | Отдаёт type as-is; options по config |
| `tests/test_scoring.py`, `tests/conftest.py` | Контракт scoring для `single_choice` |

---

## 9. Итог одной фразой

**На бэке нет типа `single` — есть `single_choice` (mystery/scoring) и legacy `select` (ЦМ).** Свести их к одному (`single_choice`) можно, но без миграции данных и alias в scoring сломаются баллы и шаблоны ценового мониторинга; фронты уже частично готовы через `select || single_choice`.
