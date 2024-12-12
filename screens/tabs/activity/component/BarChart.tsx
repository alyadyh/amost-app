"use client"

import React, { useEffect, useState } from 'react'
import { BarChart, barDataItem } from "react-native-gifted-charts"
import { VStack } from '@/components/ui/vstack'
import { Text } from '@/components/ui/text'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { Log } from "@/constants/types"
import { Dimensions } from "react-native"
import { startOfWeek, addDays } from 'date-fns'
import { fetchWeeklyLogs } from '@/api/log'

const MedicationAdherenceChart = () => {
  const [adherenceData, setAdherenceData] = useState<barDataItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const screenWidth = Dimensions.get('window').width

  // Helper function to get the date in 'YYYY-MM-DD' format using local time
  const formatDate = (date: Date) => date.toLocaleDateString('en-CA') // 'en-CA' returns 'YYYY-MM-DD'

  // Get the current week's dates (Monday to Sunday)
  const getCurrentWeekDates = (): { dayName: string, date: string }[] => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    return weekDays.map((day, index) => ({
      dayName: day,
      date: formatDate(addDays(start, index)),
    }))
  }

  // Calculate adherence percentage for a given day
  const calculateAdherenceForDay = (logs: Log[], date: string): number => {
    const logsForDay = logs.filter(log => log.log_date === date)
    const totalLogs = logsForDay.length
    const takenLogs = logsForDay.filter(log => log.taken).length
    return totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0
  }

  // Fetch logs and update adherence data
  const fetchAndUpdateAdherenceData = async () => {
    try {
      setIsLoaded(false)
      const currentDate = new Date()
      const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
      const endOfWeekDate = addDays(startOfWeekDate, 6) // Sunday

      // Fetch med_logs for the user within the current week
      const logsData = await fetchWeeklyLogs(startOfWeekDate, endOfWeekDate)

      // Get the current week's dates
      const weekDates = getCurrentWeekDates()

      // Calculate adherence data based on 'taken' logs
      const updatedAdherenceData: barDataItem[] = weekDates.map(dayInfo => ({
        value: calculateAdherenceForDay(logsData || [], dayInfo.date),
        label: dayInfo.dayName,
      }))

      // Update state with the new adherence data
      setAdherenceData(updatedAdherenceData)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    // Fetch data initially
    fetchAndUpdateAdherenceData()

    // Set up polling to refresh every 5 seconds
    const interval = setInterval(fetchAndUpdateAdherenceData, 5000)

    // Cleanup on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <VStack space="lg">
      <LinearGradient
        className="w-full rounded-xl p-6"
        colors={["#fb8c00", "#F0B201"]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <VStack space="lg">
          <Text size="xl" className="font-bold text-white">
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

export default MedicationAdherenceChart
