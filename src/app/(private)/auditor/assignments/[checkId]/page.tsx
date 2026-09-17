'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'

import {
  useGetAssignmentQuery,
  useUpdateAssignmentStatusMutation,
} from '@/entities/assignment/api/assignment.api'
import {
  useGetPublicPaDraftQuery,
  useGetPublicPaQuery,
} from '@/entities/public-pa'
import { CheckSurveyForm } from '@/features/check-survey'
import { Loader } from '@/shared/ui'

import styles from './page.module.scss'

type PageProps = {
  params: Promise<{ checkId: string }>
}

function getErrorDetail(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const data = (error as { data?: { detail?: string | { msg?: string }[] } }).data
  const detail = data?.detail
  if (typeof detail === 'string' && detail.trim()) return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}

export default function AssignmentCheckPage({ params }: PageProps) {
  const { checkId } = use(params)
  const [acceptTried, setAcceptTried] = useState(false)
  const [acceptedLocally, setAcceptedLocally] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const assignmentQuery = useGetAssignmentQuery(checkId)
  const assignment = assignmentQuery.data
  const [updateStatus, updateStatusState] = useUpdateAssignmentStatusMutation()

  const needsAccept = Boolean(
    assignment &&
      assignment.status === 'assigned' &&
      !acceptedLocally &&
      assignment.checkStatus !== 'overdue',
  )

  useEffect(() => {
    if (!assignment || acceptTried || !needsAccept) return
    setAcceptTried(true)
    void updateStatus({
      projectId: assignment.projectId,
      checkId: assignment.checkId,
      status: 'accepted',
    })
      .unwrap()
      .then(async () => {
        setAcceptedLocally(true)
        setAcceptError(null)
        await assignmentQuery.refetch()
      })
      .catch((err) => {
        setAcceptError(getErrorDetail(err, 'Не удалось принять назначение'))
      })
  }, [assignment, acceptTried, needsAccept, updateStatus, assignmentQuery])

  const inviteToken = assignment?.inviteToken
  const canLoadPa =
    Boolean(inviteToken) &&
    !needsAccept &&
    assignment?.status !== 'overdue' &&
    !updateStatusState.isLoading &&
    !acceptError

  const paQuery = useGetPublicPaQuery(inviteToken || '', {
    skip: !canLoadPa || !inviteToken,
  })
  const draftQuery = useGetPublicPaDraftQuery(
    { token: inviteToken || '', checkId },
    {
      skip: !canLoadPa || !inviteToken,
    },
  )

  if (assignmentQuery.isLoading) {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <Loader />
      </div>
    )
  }

  if (assignmentQuery.isError || !assignment) {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <div className={styles.bannerError}>
          {getErrorDetail(assignmentQuery.error, 'Проверка не найдена')}
        </div>
      </div>
    )
  }

  if (assignment.status === 'overdue' || assignment.checkStatus === 'overdue') {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <h1 className={styles.title}>{assignment.checkName}</h1>
        <div className={styles.bannerError}>
          Проверка просрочена — заполнение недоступно
        </div>
      </div>
    )
  }

  if (acceptError) {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <div className={styles.bannerError}>{acceptError}</div>
      </div>
    )
  }

  if (!canLoadPa || paQuery.isLoading || draftQuery.isLoading || updateStatusState.isLoading) {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <Loader />
      </div>
    )
  }

  if (paQuery.isError || !paQuery.data) {
    return (
      <div className={styles.page}>
        <Link href="/auditor/assignments" className={styles.backLink}>
          ← Назад к «Мои Задания»
        </Link>
        <div className={styles.bannerError}>
          {getErrorDetail(paQuery.error, 'Не удалось загрузить анкету')}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link href="/auditor/assignments" className={styles.backLink}>
        ← Назад к «Мои Задания»
      </Link>
      <CheckSurveyForm
        assignment={assignment}
        session={paQuery.data}
        initialDraft={draftQuery.data?.draft ?? null}
        onSubmitted={async () => {
          await Promise.all([assignmentQuery.refetch(), draftQuery.refetch()])
        }}
      />
    </div>
  )
}
