# Унификация типов вопросов (auditor_frontend)

Синхронизация с кабинетом anketka.

## Канон

| Тип | UI |
|---|---|
| `radio` | RadioGroup (кружки) |
| `single` | SelectPicker |

## Legacy → канон

- `single_choice`, `single_choise` → **radio** (старый одиночный список)
- `select`, `dropdown` → **single** (выпадающий список)
- Канонический `single` после миграции БД — только SelectPicker

Нормализация: `src/entities/public-pa/model/question-types.ts`  
Рендер: `src/features/check-survey/ui/question-field.tsx`

## Локальный proxy

В development API origin = `http://localhost:8000` (локальный FastAPI), в production — `https://survey-all.ru`, если не задан `API_URL`.
