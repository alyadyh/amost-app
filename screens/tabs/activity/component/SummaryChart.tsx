import React, { useEffect, useState } from 'react'
import { Text } from '@/components/ui/text'
import { BarChart, barDataItem } from "react-native-gifted-charts"
import { VStack } from '@/components/ui/vstack'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { dummyLogs } from '@/data/dummy'

// Helper function to get the date in 'YYYY-MM-DD' format using local time
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-CA')
}

// Get the current week's dates (Monday to Sunday)
const getCurrentWeekDates = (): { dayName: string, date: string }[] => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)) // Adjust to Monday

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  return weekDays.map((day, index) => {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + index)
    return {
      dayName: day,
      date: formatDate(currentDate),
    }
  })
}

// Function to calculate adherence percentage for a given day
const calculateAdherenceForDay = (logs: typeof dummyLogs, date: string): number => {
  const logsForDay = logs.filter(log => log.log_date === date)
  const totalLogs = logsForDay.length
  const takenLogs = logsForDay.filter(log => log.taken === true).length

  return totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0
}

export default function MedicationAdherenceChart() {
  const [adherenceData, setAdherenceData] = useState<barDataItem[]>([
    { value: 0, label: 'Sen' },
    { value: 0, label: 'Sel' },
    { value: 0, label: 'Rab' },
    { value: 0, label: 'Kam' },
    { value: 0, label: 'Jum' },
    { value: 0, label: 'Sab' },
    { value: 0, label: 'Min' },
  ])

  useEffect(() => {
    const weekDates = getCurrentWeekDates()

    const updatedAdherenceData = weekDates.map((dayInfo) => {
      const adherencePercentage = calculateAdherenceForDay(dummyLogs, dayInfo.date)
      return {
        value: adherencePercentage || 0,  // Ensure no undefined values
        label: dayInfo.dayName,
      }
    })

    // Log adherence data for further debugging
    console.log("Updated Adherence Data:", updatedAdherenceData)

    // Validate the structure before setting the state
    if (updatedAdherenceData.every(item => typeof item.value === 'number' && typeof item.label === 'string')) {
      setAdherenceData(updatedAdherenceData)
    } else {
      console.error("Invalid data format in adherenceData", updatedAdherenceData)
    }
  }, [])

  const minBarValue = 0.001; // To prevent passing 0 or invalid values to the chart
  const adherenceDataMaps = adherenceData.map(item => ({
    ...item,
    value: item.value > 0 ? item.value : minBarValue,
  }));

  return (
    <VStack space='lg'>
      <LinearGradient 
        className="w-full rounded-xl p-6"
        colors={["#fb8c00", "#F0B201"]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <VStack space='lg'>
          <Text size='xl' bold className='text-white'>
            Grafik Kepatuhan Anda
          </Text>
          <BarChart
            data={adherenceDataMaps}
            barWidth={15}
            height={200}
            width={230}
            minHeight={3}
            barBorderRadius={3}
            spacing={17}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelsVerticalShift={2}
            xAxisLabelTextStyle={{ color: "white", fontSize: 10 }}
            yAxisTextStyle={{ color: "white", fontSize: 12 }}
            frontColor="#ffffff"
          />
        </VStack>
      </LinearGradient>
    </VStack>
  )
}
