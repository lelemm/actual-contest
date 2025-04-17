import cron from 'node-cron'

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('[cron] Running daily GitHub sync...')
    const response = await fetch('http://localhost:3000/api/github/sync')
    console.log(`[cron] Sync completed with status: ${response.status}`)
  } catch (error) {
    console.error('[cron] Sync failed:', error)
  }
})
