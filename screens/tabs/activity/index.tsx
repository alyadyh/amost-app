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
import { dummyLogs  } from '@/data/dummy'
import ShareReport from './component/ShareExport'
import { supabase } from '@/lib/supabase'

export const Activities = () => {
  const [userName, setUserName] = useState<string>('')
  const [adherenceRate, setAdherenceRate] = useState<number>(0)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: session } = await supabase.auth.getSession()
      const userId = session?.session?.user?.id

      if (userId) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single()

        if (!error && profileData) {
          setUserName(profileData.full_name || 'No Name')
        } else {
          console.error("Error fetching profile:", error)
        }
      }
    }

    fetchProfile()
  }, [])

  // Function to get today's date in 'YYYY-MM-DD' format using local time
  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString('en-CA') // 'en-CA' returns the format 'YYYY-MM-DD'
  }

  // Calculate the adherence percentage for today
  useEffect(() => {
    const today = getTodayDate()
    const logsForToday = dummyLogs.filter(log => log.date === today)

    const totalMedications = logsForToday.length
    const takenMedications = logsForToday.filter(log => log.taken === true).length

    if (totalMedications > 0) {
      const adherencePercentage = Math.round((takenMedications / totalMedications) * 100)
      setAdherenceRate(adherencePercentage)
    } else {
      setAdherenceRate(0)
    }
  }, [])

  return (
    <SafeAreaView className="h-full bg-white">
      <VStack space="xl" className="px-6 py-16">
        <Heading size='2xl' className="text-amost-secondary-dark_1 font-black">Aktivitas</Heading>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <VStack space='2xl'>
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
                    <Text size='5xl' className="text-white font-bold ml-2">
                      {adherenceRate}
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
    </SafeAreaView>
  )
}