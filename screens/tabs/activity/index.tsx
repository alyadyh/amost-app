import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Icon } from '@/components/ui/icon'
import { ChevronRight, Percent } from 'lucide-react-native'
import BarChart from './component/BarChart'
import { ScrollView } from '@/components/ui/scroll-view'
import { Log } from "@/constants/types"
import ShareReport from './component/ShareExport'
import { fetchUserProfile, fetchLog } from '@/lib/supabase'
import TabLayout from '../layout'
import { Skeleton } from '@/components/ui/skeleton'

const ActivityScreen = () => {
  const [userName, setUserName] = useState<string>('')
  const [adherenceRate, setAdherenceRate] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Function to get today's date in 'YYYY-MM-DD' format using local time
  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString('en-CA') // 'en-CA' returns the format 'YYYY-MM-DD'
  }

  useEffect(() => {
    const fetchProfileAndLogs = async () => {
      setError(null)
      try {
        const todayDate = getTodayDate()

        const logData = await fetchLog()
        const todayLogs: Log[] = []
        const todayTakenLogs: Log[] = []

        if (logData) {
          for (const log of logData) {
            if (log.log_date === todayDate) {
              todayLogs.push(log)
              if (log.taken === true) {
                todayTakenLogs.push(log)
              }
            }
          }
        }

        // Calculate adherence rate
        const totalMedications = todayLogs.length
        const takenMedications = todayTakenLogs.length

        const adherencePercentage = totalMedications > 0
          ? Math.round((takenMedications / totalMedications) * 100)
          : 0

        setAdherenceRate(adherencePercentage)

        // Fetch user profile
        const profileData = await fetchUserProfile('user_id')

        setUserName(profileData?.full_name || 'No Name')
      } catch (err: any) {
        console.error("Error:", err)
        setError(err.message || "Terjadi kesalahan.")
      } finally {
        setIsLoaded(true)
      }
    }

    fetchProfileAndLogs()

    // Set up polling to refresh every 5 seconds
    const interval = setInterval(() => {
      fetchProfileAndLogs()
    }, 5000) // 5 seconds

    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <VStack space="xl" className='flex-1'>
      <Heading size='2xl' className="font-black text-amost-secondary-dark_1">Aktivitas</Heading>

      <ScrollView>
        <VStack space='2xl' className='mb-4'>
          <VStack>
            <Skeleton variant="rounded" className="w-full h-28" isLoaded={isLoaded}>
              <LinearGradient
                className="w-full px-6 py-8 flex-row justify-between items-center rounded-t-xl"
                colors={["#00A378", "#34B986"]}
                start={[0, 1]}
                end={[1, 0]}
              >
                <VStack space='lg'>
                  <Text className="font-medium text-white">
                    Angka kepatuhan hari ini
                  </Text>
                  <HStack space='sm' className='items-center'>
                    <Text size='5xl' className="font-bold text-white ml-2">
                      {adherenceRate || '0'}
                    </Text>
                    <Icon as={Percent} size='2xl' className='stroke-white' />
                  </HStack>
                </VStack>
              </LinearGradient>
            </Skeleton>

            <Skeleton variant="rounded" className="w-full h-12" isLoaded={isLoaded}>
              <Link href="/logMed" className='bg-amost-secondary-light_1 border border-amost-primary p-6 rounded-b-xl'>
                <HStack space='xs' className='justify-center items-center'>
                  <Text className='text-amost-primary'>Lihat semua log</Text>
                  <Icon as={ChevronRight} className='stroke-amost-primary'/>
                </HStack>
              </Link>
            </Skeleton>
          </VStack>

          <BarChart />

          <ShareReport userName={userName} />
        </VStack>
      </ScrollView>
     </VStack>
  )
}

export const Activities = () => {
  return (
    <TabLayout>
      <ActivityScreen />
    </TabLayout>
  )
}
