import React, { useEffect, useState } from "react"
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { format, subMonths, parseISO } from 'date-fns'
import { Pressable } from "@/components/ui/pressable"
import { Icon } from "@/components/ui/icon"
import { Share2 } from "lucide-react-native"
import { Medicine, Log } from "@/constants/types"
import { getUserSession, fetchMonthLogs } from '@/lib/supabase'
import { ActivityIndicator } from "react-native"

const ShareReport = ({ userName }: { userName: string }) => {
  const [logs, setLogs] = useState<Log[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const currentMonth = format(new Date(), 'MMMM yyyy') // Get current month
  const oneMonthAgo = subMonths(new Date(), 1) // Calculate one month ago

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const session = await getUserSession()
        if (!session) throw new Error("User is not logged in")

        console.log("User id:", session.user.id)

        const userId = session.user.id

        const logsData = await fetchMonthLogs(userId, oneMonthAgo)

        setLogs(logsData)
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Group logs by log_date
  const groupedLogs = logs.reduce<{ [key: string]: { med_name: string, time: string }[] }>((acc, log) => {
    const logDate = log.log_date
    const medName = log.med_name
    if (medName && log.log_time) {
      if (!acc[logDate]) acc[logDate] = []
      acc[logDate].push({ med_name: medName, time: log.log_time })
    }
    return acc
  }, {})

  // Sort the logs by date, most recent first
  const sortedGroupedLogs: [string, { med_name: string, time: string }[]][] = Object.entries(groupedLogs).sort(([dateA], [dateB]) => parseISO(dateB).getTime() - parseISO(dateA).getTime());

  const generateHTML = () => {
    const logoUrl = 'data:image/png;base64,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';
    let logTableRows = ''

    // Generate rows for logs
    sortedGroupedLogs.forEach(([date, logs]) => {
        logTableRows += `
        <tr>
            <td rowspan="${logs.length}" style="padding: 8px 12px; font-weight: bold; vertical-align: middle;">
            ${format(parseISO(date), 'dd MMMM yyyy')}
            </td>
            <td style="padding: 8px 12px">${logs[0].med_name}</td>
            <td style="padding: 8px 12px">${logs[0].time}</td>
        </tr>`

        logs.slice(1).forEach((log: { med_name: string, time: string }) => {
        logTableRows += `
            <tr>
            <td style="padding: 8px 12px">${log.med_name}</td>
            <td style="padding: 8px 12px">${log.time}</td>
            </tr>`
        })
    })

    return `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; position: relative;">
            <!-- Powered by section -->
            <div style="position: absolute; top: 20px; right: 20px; text-align: center;">
            <p style="margin-bottom: 8px; font-size: 8px;">Didukung oleh:</p>
            <img src="${logoUrl}" alt="Logo" style="width: 40px; height: auto;" />
            </div>

            <!-- Main content -->
            <h2>Riwayat Obat pada bulan ${currentMonth}</h2>
            <p>Nama: ${userName}</p>
            <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                <th style="padding: 8px 12px;">Tanggal</th>
                <th style="padding: 8px 12px;">Nama Obat</th>
                <th style="padding: 8px 12px;">Waktu Pemakaian Obat</th>
                </tr>
            </thead>
            <tbody>
                ${logTableRows}
            </tbody>
            </table>
        </body>
        </html>
    `
    }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const handlePrintAndShare = async () => {
    const htmlContent = generateHTML()
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    })

    // Share the generated PDF
    await Sharing.shareAsync(uri)
  }

  return (
    <Pressable onPress={handlePrintAndShare}>
      <Icon as={Share2} size='2xl' className='stroke-amost-secondary-dark_1' />
    </Pressable>
  )
}

export default ShareReport
