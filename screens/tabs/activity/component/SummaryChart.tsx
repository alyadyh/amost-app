import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions } from "react-native"
import { BarChart, barDataItem } from "react-native-gifted-charts"
import { VStack } from '@/components/ui/vstack'
import { Text } from '@/components/ui/text'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { format, startOfWeek, addDays } from 'date-fns'
import { LogWithMeds } from "@/constants/types"
import { fetchLogs, getUserId } from '@/utils/SupaLegend'

export default function MedicationAdherenceChart() {
  const [adherenceData, setAdherenceData] = useState<barDataItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Helper function to get the date in 'YYYY-MM-DD' format using local time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA') // 'en-CA' returns the format 'YYYY-MM-DD'
  }

  // Get the current week's dates (Monday to Sunday)
  const getCurrentWeekDates = (): { dayName: string, date: string }[] => {
    const today = new Date()
    const start = startOfWeek(today, { weekStartsOn: 1 }) // Monday as the first day
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    return weekDays.map((day, index) => {
      const currentDate = addDays(start, index)
      return {
        dayName: day,
        date: formatDate(currentDate),
      }
    })
  }

  // Function to calculate adherence percentage for a given day
  const calculateAdherenceForDay = (logs: LogWithMeds[], date: string): number => {
    const logsForDay = logs.filter(log => log.log_date === date)
    const totalLogs = logsForDay.length
    const takenLogs = logsForDay.filter(log => log.taken === true).length // Only count logs where 'taken' is true

    return totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0
  }

  const fetchUserAdherenceLogs = async () => {
    setLoading(true)
    try {
      // Get the current user ID
      const userId = getUserId()
      if (!userId) {
        throw new Error("User is not authenticated")
      }

      // Get the current week's dates
      const weekDates = getCurrentWeekDates()

      // Fetch logs using SupaLegend's fetchLogs function
      const logsData = await fetchLogs()

      // Sanitize logsData to ensure med_name is always a string
      const sanitizedLogs = logsData.map((log: any) => ({
        ...log,
        med_name: log.med_name ?? 'Unknown Medicine',  // Ensure med_name is always a string
      })) as LogWithMeds[]

      const updatedAdherenceData: barDataItem[] = weekDates.map(dayInfo => {
        const adherencePercentage = calculateAdherenceForDay(sanitizedLogs || [], dayInfo.date);
        // const adherencePercentage = calculateAdherenceForDay(sanitizedLogs, dayInfo.date)
        const validValue = adherencePercentage > 0 ? adherencePercentage : 0
        const validLabel = dayInfo.dayName

        return {
          value: validValue,
          label: validLabel,
        }
      })

      setAdherenceData(updatedAdherenceData)

    } catch (err: any) {
      console.error("Error fetching logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAdherenceLogs()
  }, [])

  useEffect(() => {
    fetchUserAdherenceLogs()
  }, [])

  const screenWidth = Dimensions.get('window').width

  return (
    <VStack space='lg'>
      <LinearGradient
        className="w-full rounded-xl p-6"
        colors={["#fb8c00", "#F0B201"]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <VStack space='lg'>
          <Text size='xl' className='font-bold text-white'>
            Grafik Kepatuhan Anda
          </Text>
          <BarChart
            data={adherenceData}
            barWidth={15}
            height={200}
            width={screenWidth - 40}
            minHeight={3}
            barBorderRadius={3}
            spacing={17}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelsVerticalShift={2}
            yAxisLabelSuffix="%"
            xAxisLabelTextStyle={{ color: "white", fontSize: 10 }}
            yAxisTextStyle={{ color: "white", fontSize: 12 }}
            frontColor="#ffffff"
          />
        </VStack>
      </LinearGradient>
    </VStack>
  )
}
