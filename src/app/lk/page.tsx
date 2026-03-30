'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userSelectors } from '@entities/user'

export default function LkPage() {
  const user = useSelector(userSelectors.data)
  const isAuthenticated = useSelector(userSelectors.isAuthenticated)

  useEffect(() => {
    console.log('LK Page mounted', { user, isAuthenticated })
  }, [user, isAuthenticated])

  if (!isAuthenticated || !user) {
    return (
      <div className="lk-page">
        <p>Загрузка данных пользователя...</p>
      </div>
    )
  }

  return (
    <div className="lk-page">
      <h1>Личный кабинет</h1>
      <div className="user-info">
        <p><strong>Имя:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role}</p>
      </div>
    </div>
  )
}
