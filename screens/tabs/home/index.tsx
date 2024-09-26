import React, { useState, useEffect, useRef } from 'react'
import { Medicine, MedForm, medFormActive, Log, medFormInactive } from '@/constants/types'
import { dummyMeds } from '@/data/dummy'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { Box } from '@/components/ui/box'
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab'
import { router } from 'expo-router'
import { LayoutRectangle } from 'react-native'
import TabLayout from '../layout'

const HomeScreen = () => {
  // Define the grouped meds type
  type GroupedMedsType = { [key: string]: Medicine[] }

  const [days, setDays] = useState([
    { id: 1, name: 'Sen', date: '' },
    { id: 2, name: 'Sel', date: '' },
    { id: 3, name: 'Rab', date: '' },
    { id: 4, name: 'Kam', date: '' },
    { id: 5, name: 'Jum', date: '' },
    { id: 6, name: 'Sab', date: '' },
    { id: 7, name: 'Min', date: '' },
  ])

  const [meds, setMeds] = useState<Medicine[]>(dummyMeds)
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay()) // 0 = Sunday, 1 = Monday, etc.
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime())
  const [showModal, setShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null)
  const scrollViewRef = useRef<ScrollView>(null) // Reference to ScrollView
  const activeMedRef = useRef<any>(null) // Reference to active medicine
  const [activeMedLayout, setActiveMedLayout] = useState<LayoutRectangle | null>(null) // State to store active med layout

  const [logs, setLogs] = useState<Log[]>([]) // Store logs

  // Function to open modal and set selected medicine
  const handleOpenModal = (med: Medicine) => {
    setSelectedMed(med)
    setShowModal(true)
  }

  // Function to log the action
  const handleLog = (log: Log) => {
    console.log("Log received in Home component:", log)
    setLogs((prevLogs) => [...prevLogs, log])
    console.log("Updated logs:", [...logs, log])
  }

  // Function to get the current week's dates for Monday to Sunday
  const getWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)) // Set to Monday

    const weekDays = days.map((day, index) => {
      const currentDay = new Date(startOfWeek)
      currentDay.setDate(startOfWeek.getDate() + index)
      return {
        ...day,
        date: currentDay.getDate().toString()
      }
    })
    setDays(weekDays)
  }

  // Function to get meds for the current day
  const getMedsForDay = (dayId: number): Medicine[] => {
    return meds
      .filter((med: Medicine) => {
        // Check if today is the day to take this medicine
        return (dayId - 1) % med.frequencyIntervalDays === 0
      })
      .sort((a: Medicine, b: Medicine) => a.reminderTimes[0].localeCompare(b.reminderTimes[0])) // Sort by reminderTimes
  }

  // Function to group meds by reminderTimes and sort them
  const groupMedsByReminderTime = (meds: Medicine[]): GroupedMedsType => {
    const groupedMeds: GroupedMedsType = {}

    meds.forEach((med: Medicine) => {
      med.reminderTimes.forEach((time: string) => {
        if (!groupedMeds[time]) {
          groupedMeds[time] = []
        }
        groupedMeds[time].push(med)
      })
    })

    // Sort reminderTimes
    const sortedGroupedMeds: GroupedMedsType = Object.keys(groupedMeds)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result: GroupedMedsType, time: string) => {
        result[time] = groupedMeds[time]
        return result
      }, {})

    return sortedGroupedMeds
  }

  // Function to get current time in 24-hour format (HH:mm)
  function getCurrentTime(): string {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  // Check if the time is within the active range (15 minutes before and after)
  const isActive = (reminderTime: string, currentTime: string): boolean => {
    // Ensure reminderTime uses a colon instead of a period for the split
    const formattedReminderTime = reminderTime.replace('.', ':')
    const [currentHour, currentMinute] = currentTime.split(':').map(Number)
    const [reminderHour, reminderMinute] = formattedReminderTime.split(':').map(Number)

    const currentTotalMinutes = currentHour * 60 + currentMinute
    const reminderTotalMinutes = reminderHour * 60 + reminderMinute

    const minutesDifference = Math.abs(currentTotalMinutes - reminderTotalMinutes)
    console.log(`Time check - Current: ${currentTime}, Reminder: ${reminderTime}, Diff: ${minutesDifference} minutes`)

    return minutesDifference <= 15
  }

  // Map getDay to the day array (0=Sun, 1=Mon, etc.)
  const getCurrentDayIndex = (): number => {
    return currentDay === 0 ? 7 : currentDay // Adjust to match the days array where 1=Monday
  }

  // Handle day click for testing
  const handleDayClick = (dayId: number) => {
    setCurrentDay(dayId) // Set the clicked day as the current day
  }

  useEffect(() => {
    getWeekDates() // Calculate and set week dates on component load

    // Update current time every minute
    const timer = setInterval(() => {
      const newTime = getCurrentTime()
      setCurrentTime(newTime)  // Update time state
      console.log(`Updated time: ${newTime}`)  // Confirm time update
    }, 60000)  // Update every minute

    return () => clearInterval(timer) // Clean up interval on component unmount
  }, [])

  const medsForDay = getMedsForDay(getCurrentDayIndex())
  const groupedMeds = groupMedsByReminderTime(medsForDay)

  // Measure the layout of the active medicine and trigger scroll if necessary
  const handleLayout = (event: any, time: string) => {
    if (isActive(time, currentTime)) {
      setActiveMedLayout(event.nativeEvent.layout)
    }
  }

  // Scroll to first active medicine if it's out of view
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
            <Pressable
              key={day.id}
              onPress={() => handleDayClick(day.id)}
            >
              <LinearGradient
                className="items-center px-2.5 py-2 rounded-lg"
                // Using a ternary operator to switch colors based on whether it's the selected day
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
 
        <ScrollView ref={scrollViewRef}>
          <VStack space='sm' className='mb-4'>
            {Object.keys(groupedMeds).length === 0 ? (
              // Display this message when no meds are scheduled for the day
              <View className='h-full items-center'>
                <Text className="text-center text-amost-secondary-dark_2">Tidak ada jadwal minum obat</Text>
              </View>
            ) : (
              Object.keys(groupedMeds).map((time) => (
                <VStack space='sm' key={time} onLayout={(event) => handleLayout(event, time)}>
                  {/* Display reminder time */}
                  <HStack space='sm' className='items-center'>
                    <Text size='xs' className='font-medium max-w-10 text-amost-secondary-dark_1'>{time}</Text>
                    <Divider className="bg-amost-secondary-dark_2" />
                  </HStack>

                  {/* Display all meds that have the same reminder time */}
                  {groupedMeds[time].map((med) => {
                    const active = isActive(time, currentTime)
                    const medImage = active 
                      ? medFormActive[med.medForm as MedForm] 
                      : medFormInactive[med.medForm as MedForm]
                    const gradientColors = active
                      ? ['#00A378', '#34B986']
                      : ['#EFEFEF', '#f7f7f7']
                    const textClass = active ? 'text-white' : 'text-amost-secondary-dark_2'
                    const strokeClass = active ? 'stroke-white' : 'stroke-amost-secondary-dark_2'

                    // Truncate medName if it exceeds 10 characters
                    const truncatedMedName = med.medName.length > 11 ? `${med.medName.slice(0, 11)}..` : med.medName

                    return (
                      <Pressable
                        key={`${time}-${med.id}`}
                        onPress={() => handleOpenModal(med)}
                      >
                        <LinearGradient
                          className='rounded-xl ml-12 p-4'
                          colors={gradientColors}
                          start={[0, 1]}
                          end={[1, 0]}
                        >
                          <HStack key={med.id} className={`justify-between items-center`}>
                            <HStack space='md' className='items-start'>
                              <Image
                                source={medImage} 
                                size='sm' 
                                alt={`${med.medName} image`}
                              />
                              <VStack>
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

        {selectedMed && (
          <LogModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            medicine={selectedMed}
            onLog={handleLog}
          />
        )}
      </VStack>
      
      <Fab 
        size="md" 
        placement="bottom right" 
        className="bg-amost-secondary-green_1"
        onPress={() => {
          router.push("/addMed")
        }}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Tambah Obat</FabLabel>
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