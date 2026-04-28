'use client'

import React from 'react'
import styles from './page.module.scss'

export default function InstructionsPage() {
  return (
    <div className={styles.instructionsPage}>
      <h1>Инструкции</h1>
      <p>Здесь будет размещена подробная информация и инструкции для аудиторов.</p>
      
      <div className={styles.sectionTitle}>Общие правила</div>
      <ul className={styles.list}>
        <li>Всегда следуйте инструкциям, указанным в задании.</li>
        <li>Делайте четкие и качественные фотографии.</li>
        <li>Соблюдайте сроки выполнения заданий.</li>
      </ul>

      <div className={styles.sectionTitle}>Часто задаваемые вопросы</div>
      <div className={styles.faq}>
        <p><strong>Как начать выполнение задания?</strong></p>
        <p>Перейдите в раздел "Мои Задания", выберите нужное задание и нажмите "Начать".</p>
        
        <p style={{ marginTop: '15px' }}><strong>Что делать, если нет связи?</strong></p>
        <p>Вы можете скачать задание для оффлайн работы. Данные будут синхронизированы при появлении связи.</p>
      </div>
    </div>
  )
}
