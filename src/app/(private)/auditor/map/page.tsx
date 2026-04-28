'use client'

import React from 'react'
import styles from './page.module.scss'

export default function MapPage() {
  return (
    <div className={styles.mapPage}>
      <h1>Карта Заданий</h1>

      <div className={styles.filterPanel}>
        <input type="text" placeholder="ID проверки" />
        <input type="text" placeholder="Название / адрес" />
        <select>
          <option value="">Статус</option>
          <option value="assigned">Назначено</option>
          <option value="in-progress">В работе</option>
          <option value="completed">Выполнено</option>
          <option value="overdue">Просрочено</option>
          <option value="free">Свободные</option>
        </select>
        <button className={styles.resetBtn}>Сбросить</button>
        <button className={styles.applyBtn}>Применить</button>
      </div>

      <div className={styles.mapArea}>
        <p>Имитация карты с маркерами заданий</p>
        <div className={`${styles.mapMarker} ${styles.marker1} ${styles.assigned}`} title="Перекрёсток, ул. Ленина 10">1</div>
        <div className={`${styles.mapMarker} ${styles.marker2} ${styles.inProgress}`} title="Пятёрочка, пр. Мира 5">2</div>
        <div className={`${styles.mapMarker} ${styles.marker3} ${styles.completed}`} title="Магнит, ул. Садовая 25">3</div>
        <div className={`${styles.mapMarker} ${styles.marker4} ${styles.overdue}`} title="Ашан, ул. Профсоюзная 100">4</div>
        <div className={`${styles.mapMarker} ${styles.marker5} ${styles.free}`} title="Лента, ул. Лесная 15 (Свободно)">F</div>
      </div>
    </div>
  )
}
