import React, { useEffect, useState } from 'react'
import { SafeAreaView } from '@/components/ui/safe-area-view'
import { ScrollView } from '@/components/ui/scroll-view'
import { Medicine } from '@/constants/types'
import { dummyMeds } from '@/data/dummy'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { AddIcon, ChevronRightIcon, Icon, SearchIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { Pressable } from '@/components/ui/pressable'
import { Link, router } from 'expo-router'
import { Heading } from '@/components/ui/heading'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Divider } from '@/components/ui/divider'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import TabLayout from '../layout'
import { fetchMedicines } from '@/utils/SupaLegend'
import { View } from '@/components/ui/view'

const MedScreen = () => {
  const [meds, setMeds] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch user-specific medicines using SupaLegend
  const fetchMedicinesData = async () => {
    try {
      const fetchedMeds = await fetchMedicines() // Fetch medicines from SupaLegend
      if (Array.isArray(fetchedMeds)) {
        setMeds(fetchedMeds) // Set the medicines state if fetched successfully
      }
    } catch (error) {
      console.error('Error fetching medicines:', error)
    }
  }

  useEffect(() => {
    fetchMedicinesData()
  }, [])


  // Filter the meds based on the search term
  const filteredMeds = searchTerm
  ? meds.filter(med => med.med_name && med.med_name.toLowerCase().includes(searchTerm.toLowerCase()))
  : meds

  return (
    <VStack space="3xl" className='flex-1'>
      <VStack>
        <Heading size='2xl' className="text-amost-secondary-dark_1 font-black">Obatku</Heading>

        <LinearGradient
          className="w-full px-6 py-8 mt-6 flex-row justify-between items-center rounded-xl"
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
      </VStack>

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

        {filteredMeds.length === 0 ? (
          <View className="items-center justify-center h-80">
            <Text className="text-amost-secondary-dark_2">Belum ada obat yang terdaftar</Text>
          </View>
         ) : (
          <ScrollView>
            <VStack space='md'>
              {filteredMeds.map(med => (
                <Link href={{ pathname: '/medDetail', params: { med: JSON.stringify(med) } }} asChild key={med.id}>
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
  )
}

export const Medication = () => {
  return (
    <TabLayout>
      <MedScreen />
    </TabLayout>
  )
}
