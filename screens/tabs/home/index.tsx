import React, { useState, useEffect, useRef } from 'react'
import { Medicine, MedForm, medFormActive, Log, medFormInactive } from '@/constants/types'
import { ScrollView } from '@/components/ui/scroll-view'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Pressable } from '@/components/ui/pressable'
import { Ellipsis } from 'lucide-react-native'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { Divider } from '@/components/ui/divider'
import { Image } from '@/components/ui/image'
import { LogModal } from './modal'
import { AddIcon, Icon } from '@/components/ui/icon'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { View } from '@/components/ui/view'
import { Fab, FabIcon } from '@/components/ui/fab'
import { router } from 'expo-router'
import { LayoutRectangle } from 'react-native'
import TabLayout from '../layout'
import { fetchMedicines, getUserId, insertOrUpdateLog, fetchLogs } from '@/utils/SupaLegend'

const HomeScreen = () => {
  // Define a type for grouping medicines by reminder times
  type GroupedMedsType = { [key: string]: Medicine[] }

  // Define a type for days in the week (with display name, date, and fullDate)
  type Day = {
    id: number
    name: string
    date: string // Displayed day (e.g., 01, 02)
    fullDate?: string // Full date in 'YYYY-MM-DD' format for logic
  }

  // State to store week days, medicines, current day, time, and selected medicine for modal
  const [days, setDays] = useState<Day[]>([
    { id: 0, name: 'Sen', date: '' },
    { id: 1, name: 'Sel', date: '' },
    { id: 2, name: 'Rab', date: '' },
    { id: 3, name: 'Kam', date: '' },
    { id: 4, name: 'Jum', date: '' },
    { id: 5, name: 'Sab', date: '' },
    { id: 6, name: 'Min', date: '' },
  ])

  const [meds, setMeds] = useState<Medicine[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay()) // Get current day of the week (0=Sunday)
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime()) // Current time in 'HH:mm'
  const [showModal, setShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null) // Selected medicine for modal
  const [selectedReminderTime, setSelectedReminderTime] = useState<string>() // Selected reminder time for modal
  const scrollViewRef = useRef<ScrollView>(null) // Reference to ScrollView for scrolling behavior
  const [activeMedLayout, setActiveMedLayout] = useState<LayoutRectangle | null>(null) // Layout of the active medicine

  // Function: Open the modal and set selected medicine and reminder time
  const handleOpenModal = (med: Medicine, reminderTime: string) => {
    setSelectedMed(med)
    setSelectedReminderTime(reminderTime)
    setShowModal(true)
  }

  // Function: Log medicine action (update logs in state)
  const handleLog = async (log: Log) => {
    setLogs((prevLogs) => [...prevLogs, log])
    await insertOrUpdateLog(log)
  }

  // Function: Calculate and set the dates for Monday to Sunday
  const getWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // Get current day of the week (0=Sunday, 1=Monday, etc.)
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Shift so that Monday is 0, and Sunday is 6
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - offset) // Set the start to Monday (id 0)

    const weekDays = days.map((day, index) => {
      const currentDay = new Date(startOfWeek)
      currentDay.setDate(startOfWeek.getDate() + index)
      return {
        ...day,
        date: currentDay.getDate().toString(), // Display day (e.g., 03, 04)
        fullDate: currentDay.toISOString().split('T')[0], // Full date for logic ('YYYY-MM-DD')
      }
    })
    setDays(weekDays)
  }

  // Function: Get medicines for a specific day based on the day index
  const getMedsForDay = (dayId: number): Medicine[] => {
    const currentDayDate = days[dayId - 1]?.fullDate // Get full date for the selected day

    // Map medicines to check if they are taken on the selected day based on logs
    return meds
      .map((med: Medicine) => {
        const logForCurrentDay = logs.find(
          (log) =>
            log.id === med.id &&
            log.reminder_time === med.reminder_times[0] &&
            log.log_date === currentDayDate // Ensure the log date matches the selected day
        )

        return {
          ...med,
          taken: logForCurrentDay ? logForCurrentDay.taken : false, // If log exists, mark as taken
        }
      })
      .filter((med) => med.taken || !med.taken) // Filter to include taken and not-taken meds
      .filter((med: Medicine) => {
        const createdDate = new Date(med.created_at || Date.now())
        const currentDayDate = new Date(`${days[dayId - 1]?.fullDate}T18:00:00Z`)

        const createdDateString = createdDate.toLocaleDateString('en-CA') // Format: YYYY-MM-DD
        const currentDayDateString = currentDayDate.toLocaleDateString('en-CA')

        // Calculate the time difference in days between created_at and the current day
        const timeDifference = Math.floor(
          (currentDayDate.setHours(0,0,0,0) - createdDate.setHours(0,0,0,0)) / (1000 * 3600 * 24)
        )

        console.log("currentDayDate: ", currentDayDateString)
        console.log("createdDate: ", createdDateString)
        console.log("Time difference: ", timeDifference)

        // Ensure medicine is displayed starting from the created_at date and according to frequency interval
        return timeDifference === 0 || (timeDifference > 0 && timeDifference % med.frequency_interval_days === 0)
      })
      .sort((a: Medicine, b: Medicine) => a.reminder_times[0].localeCompare(b.reminder_times[0])) // Sort by reminder times
  }

  // Function: Group medicines by their reminder times
  const groupMedsByReminderTime = (meds: Medicine[]): GroupedMedsType => {
    const groupedMeds: GroupedMedsType = {}

    meds.forEach((med: Medicine) => {
      med.reminder_times.forEach((time: string) => {
        if (!groupedMeds[time]) {
          groupedMeds[time] = []
        }
        groupedMeds[time].push(med)
      })
    })

    // Sort reminder times and return the grouped result
    const sortedGroupedMeds: GroupedMedsType = Object.keys(groupedMeds)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result: GroupedMedsType, time: string) => {
        result[time] = groupedMeds[time]
        return result
      }, {})

    return sortedGroupedMeds
  }

  // Function: Get the current time in 24-hour format (HH:mm)
  function getCurrentTime(): string {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  // Function: Check if the reminder time is active (within 15 minutes of the current time)
  const isActive = (reminderTime: string, currentTime: string): boolean => {
    const formattedReminderTime = reminderTime.replace('.', ':')
    const [currentHour, currentMinute] = currentTime.split(':').map(Number)
    const [reminderHour, reminderMinute] = formattedReminderTime.split(':').map(Number)

    const currentTotalMinutes = currentHour * 60 + currentMinute
    const reminderTotalMinutes = reminderHour * 60 + reminderMinute

    const minutesDifference = Math.abs(currentTotalMinutes - reminderTotalMinutes)

    return minutesDifference <= 15 // Return true if within 15 minutes
  }

  // Function: Map the day of the week to the day array index (0=Sunday, 1=Monday, etc.)
  const getCurrentDayIndex = (): number => {
    return currentDay === 0 ? 6 : currentDay - 1 // Adjust so 0=Monday and 6=Sunday
  }

  // Function: Handle day click (for testing purposes, changes the selected day)
  const handleDayClick = (dayId: number) => {
    setCurrentDay(dayId + 1) // Set the clicked day as the current day
  }

  // useEffect: Set week dates and fetch medicines on component load, update time every minute
  useEffect(() => {
    getWeekDates() // Calculate and set week dates when the component loads
    const loadMedicines = async () => {
      try {
        const medicines = await fetchMedicines()

        // Ensure the result is a valid array
        const cleanMedicines = Array.isArray(medicines) ? medicines : Object.values(medicines)

        if (Array.isArray(cleanMedicines)) {
          setMeds(cleanMedicines as Medicine[])
        } else {
          console.error("Unexpected data format, medicines is not an array.")
          setMeds([]) // Fallback in case of error
        }
      } catch (error) {
        console.error("Error fetching medicines:", error)
        setMeds([]) // Handle error case by setting an empty array
      }
    }

    loadMedicines()

    // Set an interval to update the current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000)

    return () => clearInterval(intervalId) // Clean up the interval on unmount
  }, [])

  // Function to initialize med_logs
  const initializeMedLogsForDay = async (dayDate: string) => {
    const userId = getUserId()
    if (!userId) {
      console.log('No authenticated user found.')
      return
    }

    const medsForDay = getMedsForDay(getCurrentDayIndex())

    for (const med of medsForDay) {
      for (const time of med.reminder_times) {
        const allLogs = await fetchLogs() // Fetch all logs first
        const existingLog = allLogs.find(log => log.medicine_id === med.id && log.log_date === dayDate && log.reminder_time === time)

        if (!existingLog) {
          const logData: Log = {
            id: '',
            user_id: userId,
            medicine_id: med.id,
            med_name: med.med_name,
            log_date: dayDate,
            reminder_time: time,
            taken: null,
            log_time: '00:00:00',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted: false,
          }
          await insertOrUpdateLog(logData)
        }
      }
    }
  }


  useEffect(() => {
    const initializeLogs = async () => {
      const currentDayDate = days.find(d => d.id === getCurrentDayIndex())?.fullDate
      if (currentDayDate) {
        await initializeMedLogsForDay(currentDayDate)
      }
    }

    initializeLogs()
  }, [days, currentDay]) // Runs when 'days' or 'currentDay' changes

  const medsForDay = getMedsForDay(getCurrentDayIndex()) // Get medicines for the current day
  const groupedMeds = groupMedsByReminderTime(medsForDay) // Group medicines by reminder times

  // Function: Measure the layout of the active medicine for scrolling purposes
  const handleLayout = (event: any, time: string) => {
    if (isActive(time, currentTime)) {
      setActiveMedLayout(event.nativeEvent.layout) // Store the layout of the active medicine
    }
  }

  // useEffect: Scroll to the active medicine if it's out of view
  useEffect(() => {
    if (activeMedLayout && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: activeMedLayout.y,
        animated: true,
      })
    }
  }, [activeMedLayout])

  return (
    <>
      <VStack space="xl" className='flex-1'>
        <Heading size='2xl' className="text-amost-secondary-dark_1 font-black">Hari ini</Heading>

        <HStack className='justify-between'>
          {days.map(day => (
            <Pressable key={day.id} onPress={() => handleDayClick(day.id)}>
              <LinearGradient
                className="items-center px-2.5 py-2 rounded-lg"
                colors={getCurrentDayIndex() === day.id ? ["#00A378", "#34B986"] : ['#FFFF', '#EFEFEF']}
                start={[0, 1]}
                end={[1, 0]}
              >
                <Text size='xs' bold className={`${getCurrentDayIndex() === day.id ? 'text-white' : 'text-amost-secondary-dark_2'}`}>
                  {day.name}
                </Text>
                <Text bold className={`${getCurrentDayIndex() === day.id ? 'text-white' : 'text-black'}`}>
                  {day.date}
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </HStack>

        <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
          <VStack space='sm' className='flex-1 mb-4'>
            {meds.length === 0 || Object.keys(groupedMeds).length === 0 ? (
              <View className='items-center justify-center h-full'>
                <Text className="text-amost-secondary-dark_2">Belum ada jadwal minum obat</Text>
              </View>
            ) : (
              Object.keys(groupedMeds).map((time) => (
                <VStack space='sm' key={time} onLayout={(event) => handleLayout(event, time)}>
                  {/* Display reminder time */}
                  <HStack space='sm' className='items-center'>
                    <Text size='xs' className='font-medium max-w-10 text-amost-secondary-dark_1'>{time}</Text>
                    <Divider className="bg-amost-secondary-dark_2" />
                  </HStack>

                  {/* Display all medicines with the same reminder time */}
                  {groupedMeds[time].map((med) => {
                    const active = isActive(time, currentTime)
                    const medImage = active
                      ? medFormActive[med.med_form as MedForm]
                      : medFormInactive[med.med_form as MedForm]
                    const gradientColors = active
                      ? ['#00A378', '#34B986']
                      : ['#EFEFEF', '#f7f7f7']
                    const textClass = active ? 'text-white' : 'text-amost-secondary-dark_2'
                    const strokeClass = active ? 'stroke-white' : 'stroke-amost-secondary-dark_2'

                    // Truncate medicine name if it exceeds 10 characters
                    const truncatedMedName = med.med_name.length > 11 ? `${med.med_name.slice(0, 11)}..` : med.med_name

                    return (
                      <Pressable key={`${time}-${med.id}`} onPress={() => handleOpenModal(med, time)}>
                        <LinearGradient className='rounded-xl ml-12 p-4' colors={gradientColors} start={[0, 1]} end={[1, 0]}>
                          <HStack key={med.id} className={`justify-between items-center`}>
                            <HStack space='md' className='items-start'>
                              <Image source={medImage} size='sm' alt={`${med.med_name} image`} />
                              <VStack space='xs'>
                                <Text size='xl' bold className={`${textClass}`}>{truncatedMedName}</Text>
                                <Text size='sm' className={`font-semibold ${textClass}`}>{med.dosage}</Text>
                              </VStack>
                            </HStack>
                            <Icon as={Ellipsis} size='xl' className={`${strokeClass}`} />
                          </HStack>
                        </LinearGradient>
                      </Pressable>
                    )
                  })}
                </VStack>
              ))
            )}
          </VStack>
        </ScrollView>

        {/* Modal for logging medicine intake */}
        {selectedMed && (
          <LogModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            medicine={selectedMed}
            reminderTime={selectedReminderTime || "00:00"}
            logDate={days.find(d => d.id === getCurrentDayIndex())?.fullDate || new Date().toISOString().split('T')[0]} // Log current day
            onLog={handleLog}
          />
        )}
      </VStack>

      {/* Floating action button for adding new medicine */}
      <Fab
        size="lg"
        placement="bottom right"
        className="bg-amost-secondary-green_1"
        onPress={() => router.push("/addMed")}
      >
        <FabIcon as={AddIcon} />
      </Fab>
    </>
  )
}

export const Home = () => {
  return (
    <TabLayout>
      <HomeScreen />
    </TabLayout>
  )
}
