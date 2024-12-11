// Core dependencies
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'

// Components
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { ScrollView } from '@/components/ui/scroll-view'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { AddIcon, ChevronRightIcon, Icon, SearchIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { Pressable } from '@/components/ui/pressable'
import { Heading } from '@/components/ui/heading'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Divider } from '@/components/ui/divider'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { View } from '@/components/ui/view'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshControl } from '@/components/ui/refresh-control'

// Constants
import { Medicine } from '@/constants/types'
import { dummyMeds } from '@/data/dummy'

// Utils and Libs
import { fetchMedicines } from '@/lib/supabase'

// Layout
import TabLayout from '../layout'

const MedScreen = () => {
  const [meds, setMeds] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    setIsLoaded(false)
    try {
      const data = await fetchMedicines()
      setMeds(data || [])
    } catch (error) {
      console.error('Error fetching medicines:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const data = await fetchMedicines()
      setMeds(data || [])
    } catch (error) {
      console.error('Error refreshing medicines:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filter the meds based on the search term
  const filteredMeds = searchTerm
  ? meds.filter(med => med.med_name && med.med_name.toLowerCase().includes(searchTerm.toLowerCase()))
  : meds

  return (
    <VStack space="xl" className='flex-1'>
      <Heading size='2xl' className="text-amost-secondary-dark_1 font-black">Obatku</Heading>

        <ScrollView
          refreshControl={
            <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#00A378"
            colors={['#00A378']}
            />
          }
        >
        <VStack space='4xl'>
          <LinearGradient
            className="w-full px-6 py-8 flex-row justify-between items-center rounded-xl"
            colors={["#00A378", "#34B986"]}
            start={[0, 1]}
            end={[1, 0]}
            >
            <VStack space='lg'>
              <Text className="font-medium text-white">
                Total obat saat ini
              </Text>
              <Text size='5xl' className="font-bold text-white ml-2">
                {meds.length}
              </Text>
            </VStack>
            <Button
              size="md"
              variant="solid"
              action="primary"
              className='bg-white rounded-full'
              onPress={() => {
                router.push("/addMed")
              }}
            >
              <HStack className='items-center'>
                <ButtonIcon as={AddIcon} className='stroke-amost-primary' />
                <ButtonText size='sm' className='font-normal text-amost-primary'> Tambah</ButtonText>
              </HStack>
            </Button>
          </LinearGradient>
          <VStack space='md' className='flex-1'>
            <HStack space='lg' className='flex-row items-center'>
              <Text size='2xl' className="text-amost-secondary-dark_1 font-black">Daftar Obatku</Text>
            </HStack>

            <Input size='sm' className='px-3 rounded-full'>
              <InputSlot>
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField
                placeholder="Cari obatku..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                />
            </Input>

            {!isLoaded ? (
              // Skeleton loader for the medicine list
              <VStack space="md">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    className="h-20 w-full"
                    isLoaded={false}
                  />
                ))}
              </VStack>
            ) : filteredMeds.length === 0 ? (
              <View className="items-center justify-center h-80">
                <Text className="text-amost-secondary-dark_2">Belum ada obat yang terdaftar</Text>
              </View>
            ) : (
              <ScrollView>
                <VStack space='md'>
                  {filteredMeds.map(med => (
                    <Link href={{ pathname: '/medDetail', params: { medId: med.id } }} asChild key={med.id}>
                      <Pressable>
                        <LinearGradient
                          className='rounded-xl'
                          colors={["#fb8c00", "#F0B201"]}
                          start={[0, 1]}
                          end={[1, 0]}
                        >
                          <HStack className='justify-between p-4 items-center'>
                            <VStack>
                              <Text size='xl' bold className='font-medium text-white mb-1'>{med.med_name}</Text>
                              <HStack>
                                <Text size='sm' className='font-semibold text-white'>{med.dosage}</Text>
                                <Divider
                                  orientation="vertical"
                                  className='border-white mx-2.5'
                                />
                                <Text size='sm' className='font-semibold text-white'>
                                  {med.frequency}
                                </Text>
                              </HStack>
                            </VStack>
                            <Icon as={ChevronRightIcon} className='stroke-white' />
                          </HStack>
                        </LinearGradient>
                      </Pressable>
                    </Link>
                  ))}
                </VStack>
              </ScrollView>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  )
}

export const Medication = () => {
  return (
    <TabLayout>
      <MedScreen />
    </TabLayout>
  )
}
