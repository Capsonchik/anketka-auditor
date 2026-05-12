'use client'

import { useTransition } from 'react'
import { Button } from '@/shared/ui'
import { logoutAction } from '../api/logout.action'

export const LogoutButton = () => {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isPending}
      variant="danger"
      appearance='ghost'
      animation='collision'
    >
      {isPending ? 'Выход...' : 'Выйти'}
    </Button>
  )
}


