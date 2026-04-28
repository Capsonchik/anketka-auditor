'use client'

import React from 'react'
import styles from './page.module.scss'

const HISTORY_DATA = [
  { date: '01.08.2025', title: 'KVI-мониторинг (СОФ)', tt: 'Перекрёсток, ул. Ленина 10', status: 'Выполнено', rating: '4.9', price: '400 ₽', comment: 'Фото подтверждены.', id: 'CHK-0001' },
  { date: '30.07.2025', title: 'Полочный мониторинг', tt: 'Пятёрочка, пр. Мира 5', status: 'Выполнено', rating: '4.7', price: '350 ₽', comment: 'Исправлено после доработки.', id: 'CHK-0002' },
  { date: '29.07.2025', title: 'KVI-мониторинг (Молочка)', tt: 'Магнит, ул. Садовая 25', status: 'Выполнено', rating: '5.0', price: '300 ₽', comment: 'Отличное качество.', id: 'CHK-0003' },
]

export default function StatsPage() {
  return (
    <div className={styles.statsPage}>
      <h1>Моя Эффективность</h1>

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h2>Выполнено за месяц</h2>
          <div className={styles.value}>45</div>
          <div className={styles.description}>Завершено проверок</div>
        </div>
        <div className={styles.card}>
          <h2>Средний балл качества</h2>
          <div className={styles.value}>4.8</div>
          <div className={styles.description}>По оценкам супервизора</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Рейтинг</div>
      <div className={styles.ratingBlock}>
        <h2>Мой рейтинг</h2>
        <div className={styles.value}>#12</div>
        <div className={styles.description}>Среди всех аудиторов</div>
        <p style={{ marginTop: '15px' }}>Вы входите в топ 15% лучших аудиторов!</p>
        <div className={styles.chartPlaceholder}>График динамики рейтинга (placeholder)</div>
      </div>

      <div className={styles.sectionTitle}>Оплата / Баланс</div>
      <div className={styles.balanceBlock}>
        <h2>Текущий баланс</h2>
        <div className={styles.value}>15 500 ₽</div>
        <div className={styles.description}>К выплате за текущий период</div>
        <button className={styles.detailsBtn}>Запросить детализацию</button>
      </div>

      <div className={styles.sectionTitle}>История Проверок</div>
      <div className={styles.tableWrapper}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Задание</th>
              <th>ТТ / Адрес</th>
              <th>Статус</th>
              <th>Оценка</th>
              <th>Цена</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_DATA.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.title}</td>
                <td>{item.tt}</td>
                <td>{item.status}</td>
                <td>{item.rating}</td>
                <td>{item.price}</td>
                <td><button className={styles.viewBtn}>Просмотреть</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
