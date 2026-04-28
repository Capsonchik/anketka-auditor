'use client'

import React from 'react'
import styles from './page.module.scss'

export default function SupportPage() {
  return (
    <div className={styles.supportPage}>
      <h1>Поддержка и Обратная связь</h1>
      <p>Если у вас возникли вопросы или проблемы, пожалуйста, заполните форму ниже или свяжитесь с нами.</p>
      <form className={styles.supportForm}>
        <div className={styles.formGroup}>
          <label htmlFor="subject">Тема обращения:</label>
          <input type="text" id="subject" placeholder="Например: Проблема с анкетой, Вопрос по оплате" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Сообщение:</label>
          <textarea id="message" placeholder="Опишите вашу проблему или вопрос максимально подробно"></textarea>
        </div>

        <button type="submit" className={styles.submitBtn}>Отправить сообщение</button>
      </form>
      <div className={styles.contactInfo}>
        <h2>Контакты</h2>
        <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
        <p><strong>Email:</strong> support@survey-all.com</p>
        <p><strong>Время работы:</strong> Пн-Пт, 9:00 - 18:00 МСК</p>
      </div>
    </div>
  )
}
