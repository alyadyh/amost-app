import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Icon } from '@/components/ui/icon'
import { ChevronRight, Percent } from 'lucide-react-native'
import SummaryChart from './component/SummaryChart'
import { ScrollView } from '@/components/ui/scroll-view'
import { Medicine, Log } from "@/constants/types"
import ShareReport from './component/ShareExport'
import { fetchUserProfile, fetchLog } from '@/lib/supabase'
import TabLayout from '../layout'

const ActivityScreen = () => {
  const [userName, setUserName] = useState<string>('')
  const [adherenceRate, setAdherenceRate] = useState<number>(0)
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Function to get today's date in 'YYYY-MM-DD' format using local time
  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString('en-CA') // 'en-CA' returns the format 'YYYY-MM-DD'
  }

  useEffect(() => {
    const fetchProfileAndLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const logData = await fetchLog()
        const takenLogs: Log[] = []
        if (logData) {
          for (const log of logData) {
            if (log.taken === true) {
              takenLogs.push(log)
            }
          }
        }

        // Set logs state to takenLogs
        setLogs(takenLogs)

        // Calculate adherence rate
        const totalMedications = logData?.length || 0
        const takenMedications = takenLogs.length

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
        setLoading(false)
      }
    }

    fetchProfileAndLogs()
  }, [])

  return (
    <VStack space="xl" className='flex-1'>
      <Heading size='2xl' className="font-black text-amost-secondary-dark_1">Aktivitas</Heading>

      <ScrollView>
        <VStack space='2xl' className='mb-4'>
          <VStack>
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
            <Link href="/logMed" className='bg-amost-secondary-light_1 border border-amost-primary p-6 rounded-b-xl'>
              <HStack space='xs' className='justify-center items-center'>
                <Text className='text-amost-primary'>Lihat semua log</Text>
                <Icon as={ChevronRight} className='stroke-amost-primary'/>
              </HStack>
            </Link>
          </VStack>

          <SummaryChart />

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
