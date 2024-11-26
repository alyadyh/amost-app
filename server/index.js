import express from 'express'
import bodyParser from 'body-parser'
import cron from 'node-cron'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const SUPABASE_URL = 'https://snyctjesxxylnzvygnrn.supabase.co'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueWN0amVzeHh5bG56dnlnbnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNDYyMDksImV4cCI6MjA0MjgyMjIwOX0.L38eKK0OtK_qMIdePJHYkJMJ5LcQ9X8HHgJ2mfBsfIw'
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Initialize Express
const app = express()
app.use(bodyParser.json())

// Function to send push notification
const sendPushNotification = async (expoPushToken, title, body, data) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data
  }

  try {
    await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log('Push notification sent:', message)
  } catch (error) {
    console.error('Error sending push notification:', error.message)
  }
}

// Function to handle notifications for logs
const handleNotification = async () => {
  const { data: logs, error } = await supabase
    .from('logs')
    .select(
      `
      id,
      user_id,
      med_name,
      dosage,
      instructions,
      reminder_time,
      profiles (expo_push_token)
    `
    )
    .eq('taken', null)
    .eq('log_date', new Date().toISOString().split('T')[0])

  if (error) {
    console.error('Error fetching logs:', error.message)
    return
  }

  logs.forEach(log => {
    const { id, med_name, dosage, instructions, reminder_time, profiles } = log

    if (!profiles?.expo_push_token) {
      console.warn(`User ${log.user_id} has no push token.`)
      return
    }

    const [hours, minutes] = reminder_time.split(':')
    const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`

    cron.schedule(cronTime, async () => {
      await sendPushNotification(profiles.expo_push_token, `${med_name} - ${dosage}`, instructions, {
        logId: id,
        medName: med_name,
        dosage,
        actionButtons: [
          { id: 'taken', label: 'Sudah' },
          { id: 'remind', label: 'Ingatkan lagi nanti (15 menit)' }
        ]
      })
    })
  })
}

// Endpoint to handle button interactions
app.post('/notification-response', async (req, res) => {
  const { logId, action } = req.body

  if (!logId || !action) {
    return res.status(400).send('Missing parameters')
  }

  if (action === 'taken') {
    const { error } = await supabase
      .from('logs')
      .update({
        taken: true,
        log_time: new Date().toTimeString().split(' ')[0]
      })
      .eq('id', logId)

    if (error) {
      console.error('Error updating log:', error.message)
      return res.status(500).send('Error updating log')
    }
    return res.send('Log updated as taken.')
  } else if (action === 'remind') {
    const newReminderTime = new Date(Date.now() + 15 * 60000)
    const [hours, minutes] = [newReminderTime.getHours(), newReminderTime.getMinutes()]
    const cronTime = `${minutes} ${hours} * * *`

    cron.schedule(cronTime, async () => {
      const { data: log, error } = await supabase
        .from('logs')
        .select('profiles (expo_push_token), med_name, dosage, instructions')
        .eq('id', logId)
        .single()

      if (error || !log?.profiles?.expo_push_token) {
        console.error('Error fetching log for reminder:', error?.message)
        return
      }

      await sendPushNotification(log.profiles.expo_push_token, `${log.med_name} - ${log.dosage}`, log.instructions, {
        logId,
        medName: log.med_name,
        dosage: log.dosage
      })
    })

    return res.send('Reminder scheduled for 15 minutes later.')
  } else {
    return res.status(400).send('Invalid action.')
  }
})

// Run the notification handler every minute
cron.schedule('* * * * *', handleNotification)

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
