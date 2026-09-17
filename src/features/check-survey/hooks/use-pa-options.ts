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

export function usePaOptions({
  token,
  questions,
  allQuestionCodes,
  answers,
  enabled = true,
}: UsePaOptionsParams) {
  const [fetchOptions] = useLazyGetPublicPaOptionsQuery()
  const [optionsByCode, setOptionsByCode] = useState<Record<string, PublicPaOptionsItem[]>>({})
  const keyByCodeRef = useRef<Record<string, string>>({})

  const clearOptionsForCodes = useCallback((codes: string[]) => {
    if (!codes.length) return
    setOptionsByCode((prev) => {
      const next = { ...prev }
      for (const code of codes) delete next[code]
      return next
    })
    for (const code of codes) delete keyByCodeRef.current[code]
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

  useEffect(() => {
    if (!enabled || !token) return
    let cancelled = false

    async function loadAll() {
      for (const question of questions) {
        const code = questionAnswerKey(question)
        if (!code) continue
        const params = buildPaOptionsRequestParams({
          config: question.config,
          answers,
        })
        if (!params) continue

        const depends = getDependsOnCodesFromConfig(question.config)
        // Как в PaPage: ждём только depends, которые реально есть вопросами в анкете
        const missingDepends = depends
          .filter((dep) => knownCodes.has(dep))
          .some((dep) => {
            const value = answers[dep]
            return !(typeof value === 'string' || typeof value === 'number') || !String(value).trim()
          })
        if (missingDepends) continue

        const key = buildPaOptionsCacheKey(params)
        if (keyByCodeRef.current[code] === key) continue

        try {
          const result = await fetchOptions({ token, params }).unwrap()
          if (cancelled) return
          keyByCodeRef.current[code] = key
          setOptionsByCode((prev) => ({ ...prev, [code]: result.items ?? [] }))
        } catch {
          // keep static options
        }
      }
    }

    void loadAll()
    return () => {
      cancelled = true
    }
  }, [answers, answersKey, enabled, fetchOptions, knownCodes, questions, questionsKey, token])

  return { optionsByCode, clearOptionsForCodes }
}
