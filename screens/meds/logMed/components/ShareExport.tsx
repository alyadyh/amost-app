import React, { useEffect, useState } from "react"
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { format, subMonths, parseISO } from 'date-fns'
import { Pressable } from "@/components/ui/pressable"
import { Icon } from "@/components/ui/icon"
import { Share2 } from "lucide-react-native"
import { Log } from "@/constants/types"
import { getUserSession, fetchMonthLogs } from '@/lib/supabase'
import { Image } from "react-native"
import * as FileSystem from 'expo-file-system'
import { Skeleton } from "@/components/ui/skeleton"

const ShareReport = ({ userName }: { userName: string }) => {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const currentMonth = format(new Date(), 'MMMM yyyy') // Get current month
  const oneMonthAgo = subMonths(new Date(), 1) // Calculate one month ago

  useEffect(() => {
    const fetchData = async () => {
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
        setIsLoaded(true)
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
  const logoUri = Image.resolveAssetSource(require('@/assets/images/logo.png')).uri
  let logTableRows = ''

  if (sortedGroupedLogs.length === 0) {
    // Render a single row with the message if there are no logs
    logTableRows = `
      <tr>
        <td colspan="3" style="padding: 16px; text-align: center; font-size: 12px; color: #666;">
          Belum ada riwayat minum obat dalam satu bulan terakhir
        </td>
      </tr>`
  } else {
    // Generate rows for logs
    sortedGroupedLogs.forEach(([date, logs]) => {
      logTableRows += `
        <tr>
          <td rowspan="${logs.length}" style="padding: 8px 12px; font-weight: bold; vertical-align: middle; font-size: 12px; width: 30%; text-align: center">
            ${format(parseISO(date), 'dd MMMM yyyy')}
          </td>
          <td style="padding: 8px 12px; font-size: 12px">${logs[0].med_name}</td>
          <td style="padding: 8px 12px; font-size: 12px; width: 20%; text-align: center">${logs[0].time}</td>
        </tr>`

      logs.slice(1).forEach((log) => {
        logTableRows += `
          <tr>
            <td style="padding: 8px 12px"; font-size: 12px">${log.med_name}</td>
            <td style="padding: 8px 12px; width: 20%; text-align: center"; font-size: 12px">${log.time}</td>
          </tr>`
      });
    });
  }

  return `
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; position: relative;">
      <!-- Powered by section -->
      <div style="position: absolute; top: 20px; right: 20px; text-align: center;">
        <p style="margin-bottom: 8px; font-size: 8px;">Dicetak oleh:</p>
        <img src="${logoUri}" alt="Logo" style="width: 40px; height: auto;" />
      </div>

      <!-- Main content -->
      <h3>Riwayat obat dalam satu bulan terakhir</h3>
      <p>Nama: ${userName}</p>
      <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px 12px; font-size: 12px; width: 30%;">Tanggal</th>
            <th style="padding: 8px 12px; font-size: 12px">Nama Obat</th>
            <th style="padding: 8px 12px; font-size: 12px; width: 20%;">Waktu Pemakaian Obat</th>
          </tr>
        </thead>
        <tbody>
          ${logTableRows}
        </tbody>
      </table>
    </body>
    </html>`
  }

  const handlePrintAndShare = async () => {
    const htmlContent = generateHTML()
    try {
      // Generate the PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Define the new file path with the desired name
      const newFilePath = `${FileSystem.cacheDirectory}Laporan Obat ${userName} bulan ${currentMonth}.pdf`;

      // Copy the generated file to the new path
      await FileSystem.copyAsync({
        from: uri,
        to: newFilePath,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newFilePath);
      } else {
        console.warn('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error during file generation or sharing:', error);
    }
  }

  return (
    <Pressable onPress={handlePrintAndShare}>
      <Skeleton variant="circular" className="w-12 h-12" isLoaded={isLoaded}>
        <Icon as={Share2} size='2xl' className='stroke-amost-secondary-dark_1' />
      </Skeleton>
    </Pressable>
  )
}

export default ShareReport
