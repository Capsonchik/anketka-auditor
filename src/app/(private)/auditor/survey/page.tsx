'use client'

import React from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function SurveyPage() {
  return (
    <div className={styles.surveyPage}>
      <Link href="/auditor/assignments" className={styles.backLink}>
        &lt; Назад к "Мои Задания"
      </Link>

      <h1>Детали Задания: KVI-мониторинг (СОФ)</h1>
      <div className={styles.timer}>Осталось: 01:23:45</div>

      <div className={styles.taskInfo}>
        <p><strong>ТТ:</strong> Перекрёсток, ул. Ленина 10, Москва</p>
        <p><strong>Срок:</strong> 01.08.2025, 14:00 МСК</p>
        <p><strong>Статус:</strong> <span style={{ color: '#007bff', fontWeight: 'bold' }}>В РАБОТЕ</span></p>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>Прогресс заполнения: 60%</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Общая информация по визиту</div>
      <div className={styles.formGroup}>
        <label>Время начала визита:</label>
        <input type="text" value="01.08.2025 10:30" disabled />
      </div>
      <div className={styles.formGroup}>
        <label>Фото фасада ТТ:</label>
        <input type="file" accept="image/*" />
      </div>

      <div className={styles.sectionTitle}>Заполнение анкеты</div>
      <div className={styles.card}>
        <h3>Товар: Яблоки Голден (KVI)</h3>
        <div className={styles.formGroup}>
          <label>Название на ценнике:*</label>
          <input type="text" placeholder="Введите название с ценника" />
        </div>
        <div className={styles.formGroup}>
          <label>Цена регулярная:*</label>
          <input type="number" placeholder="Введите цену" />
        </div>
        <div className={styles.formGroup}>
          <label>Фото ценника:*</label>
          <input type="file" accept="image/*" />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.saveBtn}>Сохранить черновик</button>
        <button className={styles.submitBtn}>Отправить</button>
      </div>
    </div>
  )
}
