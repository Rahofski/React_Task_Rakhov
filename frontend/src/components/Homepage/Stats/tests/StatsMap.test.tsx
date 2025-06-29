import { expect, test } from 'vitest'
import type { AnalyticsResponse } from '../../../../api/csvAnalytics'

import { STATS_ITEMS } from '../StatsItem/StatsMap'

test('объект статистики должен преобразовываться в массив объектов с необходимыми полями', () => {
  const mockStats: AnalyticsResponse = {
    total_spend_galactic: 1234.56,
    rows_affected: 42,
    less_spent_at: 2,
    big_spent_at: 1,
    big_spent_value: 789.01,
    less_spent_value: 100,
    average_spend_galactic: 456.78,
    less_spent_civ: 'humans',
    big_spent_civ: 'monsters',
  }

  expect(STATS_ITEMS(mockStats)).toEqual([
    {
      title: '1235',
      text: 'Общие расходы в галактических кредитах',
    },
    {
      text: 'цивилизация с минимальными расходами',
      title: 'humans',
    },
    {
      text: 'Количество обработанных записей',
      title: '42',
    },
    {
      text: 'день года с максимальными расходами',
      title: '2 января',
    },
    {
      text: 'день года с минимальными расходами',
      title: '3 января',
    },
    {
      text: 'максимальная сумма расходов за день',
      title: '789',
    },
    {
      text: 'цивилизация с максимальными расходами',
      title: 'monsters',
    },
    {
      text: 'средние расходы в галактических кредитах',
      title: '457',
    },
  ])
})
