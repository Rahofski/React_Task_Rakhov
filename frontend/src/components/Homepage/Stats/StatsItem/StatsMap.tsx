import type { AnalyticsResponse } from '../../../../api/csvAnalytics'

function formatDayOfYear(dayOfYear: number): string {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ]
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  let day = dayOfYear + 1
  let monthIndex = 0

  while (monthIndex < daysInMonth.length && day > daysInMonth[monthIndex]) {
    day -= daysInMonth[monthIndex]
    monthIndex++
  }

  return `${day} ${months[monthIndex]}`
}

// Функция для округления числовых значений
const roundValue = (value: number | null): string => {
  return value !== null ? Math.round(value).toString() : ''
}

export const STATS_ITEMS = (stats: AnalyticsResponse) => [
  {
    title: roundValue(stats.total_spend_galactic),
    text: 'Общие расходы в галактических кредитах',
  },
  {
    text: 'цивилизация с минимальными расходами',
    title: stats.less_spent_civ ? stats.less_spent_civ.toString() : '',
  },
  {
    text: 'Количество обработанных записей',
    title: stats.rows_affected ? stats.rows_affected.toString() : '',
  },
  {
    text: 'день года с максимальными расходами',
    title: stats.big_spent_at ? formatDayOfYear(Number(stats.big_spent_at)) : '',
  },
  {
    text: 'день года с минимальными расходами',
    title: stats.less_spent_at ? formatDayOfYear(Number(stats.less_spent_at)) : '',
  },
  {
    text: 'максимальная сумма расходов за день',
    title: roundValue(stats.big_spent_value),
  },
  {
    text: 'цивилизация с максимальными расходами',
    title: stats.big_spent_civ ? stats.big_spent_civ.toString() : '',
  },
  {
    text: 'средние расходы в галактических кредитах',
    title: roundValue(stats.average_spend_galactic),
  },
]
