'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLazyGetPublicPaOptionsQuery } from '@/entities/public-pa'
import type { PublicPaOptionsItem, PublicPaQuestion } from '@/entities/public-pa'
import { questionAnswerKey } from '@/entities/public-pa'

import type { AnswersMap } from '../lib/answer-model'
import {
  buildPaOptionsCacheKey,
  buildPaOptionsRequestParams,
  getDependsOnCodesFromConfig,
} from '../lib/build-pa-options-params'

type UsePaOptionsParams = {
  token: string
  questions: PublicPaQuestion[]
  /** Коды всех вопросов анкеты — legacy depends без таких вопросов игнорируем (как в /pa) */
  allQuestionCodes?: Set<string>
  answers: AnswersMap
  enabled?: boolean
}

type CacheStore = Record<string, Record<string, PublicPaOptionsItem[]>>

export function usePaOptions({
  token,
  questions,
  allQuestionCodes,
  answers,
  enabled = true,
}: UsePaOptionsParams) {
  const [fetchOptions] = useLazyGetPublicPaOptionsQuery()
  const [optionsByCode, setOptionsByCode] = useState<Record<string, PublicPaOptionsItem[]>>({})
  const [loadingByCode, setLoadingByCode] = useState<Record<string, boolean>>({})
  const keyByCodeRef = useRef<Record<string, string>>({})
  const storeRef = useRef<CacheStore>({})
  const inflightRef = useRef<Map<string, Promise<PublicPaOptionsItem[]>>>(new Map())

  const setLoading = useCallback((code: string, loading: boolean) => {
    setLoadingByCode((prev) => {
      if (Boolean(prev[code]) === loading) return prev
      return { ...prev, [code]: loading }
    })
  }, [])

  const clearOptionsForCodes = useCallback((codes: string[]) => {
    if (!codes.length) return
    setOptionsByCode((prev) => {
      const next = { ...prev }
      for (const code of codes) delete next[code]
      return next
    })
    setLoadingByCode((prev) => {
      const next = { ...prev }
      for (const code of codes) delete next[code]
      return next
    })
    for (const code of codes) {
      delete keyByCodeRef.current[code]
      delete storeRef.current[code]
    }
  }, [])

  const questionsKey = useMemo(
    () => questions.map((q) => questionAnswerKey(q)).join('|'),
    [questions],
  )

  const pageQuestionCodes = useMemo(() => {
    const set = new Set<string>()
    for (const q of questions) {
      const code = questionAnswerKey(q)
      if (code) set.add(code)
    }
    return set
  }, [questions])

  const knownCodes = allQuestionCodes ?? pageQuestionCodes

  const answersKey = useMemo(() => JSON.stringify(answers), [answers])

  const resolveParams = useCallback(
    (question: PublicPaQuestion, ans: AnswersMap): Record<string, string> | null => {
      const params = buildPaOptionsRequestParams({
        config: question.config,
        answers: ans,
      })
      if (!params) return null

      const depends = getDependsOnCodesFromConfig(question.config)
      const missingDepends = depends
        .filter((dep) => knownCodes.has(dep))
        .some((dep) => {
          const value = ans[dep]
          return !(typeof value === 'string' || typeof value === 'number') || !String(value).trim()
        })
      if (missingDepends) return null
      return params
    },
    [knownCodes],
  )

  const ensureCached = useCallback(
    async (code: string, params: Record<string, string>): Promise<PublicPaOptionsItem[]> => {
      const key = buildPaOptionsCacheKey(params)
      const hit = storeRef.current[code]?.[key]
      if (hit) return hit

      const inflightId = `${code}::${key}`
      const existing = inflightRef.current.get(inflightId)
      if (existing) return existing

      const promise = fetchOptions({ token, params })
        .unwrap()
        .then((result) => {
          const items = result.items ?? []
          if (!storeRef.current[code]) storeRef.current[code] = {}
          storeRef.current[code][key] = items
          return items
        })
        .catch(() => {
          const items: PublicPaOptionsItem[] = storeRef.current[code]?.[key] ?? []
          if (!storeRef.current[code]) storeRef.current[code] = {}
          storeRef.current[code][key] = items
          return items
        })
        .finally(() => {
          inflightRef.current.delete(inflightId)
        })

      inflightRef.current.set(inflightId, promise)
      return promise
    },
    [fetchOptions, token],
  )

  // Загрузка по текущим answers (открытие позиции accordion / смена ответа)
  useEffect(() => {
    if (!enabled || !token) return
    let cancelled = false

    async function loadActive() {
      for (const question of questions) {
        const code = questionAnswerKey(question)
        if (!code) continue
        const params = resolveParams(question, answers)
        if (!params) {
          if (keyByCodeRef.current[code]) {
            delete keyByCodeRef.current[code]
          }
          setLoading(code, false)
          continue
        }

        const key = buildPaOptionsCacheKey(params)
        if (keyByCodeRef.current[code] === key && storeRef.current[code]?.[key]) {
          setLoading(code, false)
          continue
        }

        const cached = storeRef.current[code]?.[key]
        if (cached) {
          keyByCodeRef.current[code] = key
          setOptionsByCode((prev) => ({ ...prev, [code]: cached }))
          setLoading(code, false)
          continue
        }

        setLoading(code, true)
        try {
          const items = await ensureCached(code, params)
          if (cancelled) return
          keyByCodeRef.current[code] = key
          setOptionsByCode((prev) => ({ ...prev, [code]: items }))
        } finally {
          if (!cancelled) setLoading(code, false)
        }
      }
    }

    void loadActive()
    return () => {
      cancelled = true
    }
  }, [
    answers,
    answersKey,
    enabled,
    ensureCached,
    questions,
    questionsKey,
    resolveParams,
    setLoading,
    token,
  ])

  return { optionsByCode, loadingByCode, clearOptionsForCodes }
}
