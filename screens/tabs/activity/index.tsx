import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Icon } from '@/components/ui/icon'
import { ChevronRight, Percent } from 'lucide-react-native'
import SummaryChart from './component/SummaryChart'
import { ScrollView } from '@/components/ui/scroll-view'
import { LogWithMeds } from "@/constants/types"
import ShareReport from './component/ShareExport'
import { fetchLogs, fetchUserProfile, getUserId } from '@/utils/SupaLegend'
import TabLayout from '../layout'

const ActivityScreen = () => {
  const [userName, setUserName] = useState<any>('')
  const [adherenceRate, setAdherenceRate] = useState<number>(0)
  const [logs, setLogs] = useState<LogWithMeds[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileAndLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get the current user ID from SupaLegend
        const userId = getUserId()

        if (!userId) {
          throw new Error("User is not authenticated")
        }

        // Fetch user's logs with medicines from SupaLegend
        const logsData = await fetchLogs()

        // Get today's date in 'YYYY-MM-DD' format
        const todayDate = new Date().toLocaleDateString('en-CA') // 'en-CA' for 'YYYY-MM-DD'
        const todaysLogs = logsData?.filter((log: LogWithMeds) => log.log_date === todayDate) || []

        setLogs(todaysLogs)

        // Calculate adherence rate
        const totalMedications = logsData?.length || 0
        const takenMedications = todaysLogs.filter(log => log.taken).length

        const adherencePercentage = totalMedications > 0
          ? Math.round((takenMedications / totalMedications) * 100)
          : 0

        setAdherenceRate(adherencePercentage)

        // Fetch user profile from SupaLegend
        const profileData = await fetchUserProfile()
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
