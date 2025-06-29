export const mockSuccessResponse = async (page) => {
  await page.route('**/aggregate*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_spend_galactic: 15000,
        rows_affected: 150,
        less_spent_at: 5,
        big_spent_at: 145,
        less_spent_value: 50,
        big_spent_value: 950,
        average_spend_galactic: 100,
        big_spent_civ: 'Крилл',
        less_spent_civ: 'Марсиане',
      }),
    })
  })
}

export const mockFailedResponse = async (page) => {
  await page.route('**/aggregate*', (route) => {
    route.fulfill({
      status: 500,
      body: 'Internal Server Error',
    })
  })
}
