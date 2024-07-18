import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { Octicons } from '@expo/vector-icons'

const Medication = () => {
  const [meds, setMeds] = useState([
    { id: '1', range: '1 kali, tiap hari', name: 'Amoxicilin', dose: '1 Tablet' },
    { id: '2', range: '1 kali, tiap hari', name: 'Paracetamol', dose: '2 Tablet' },
    { id: '3', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '4', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '2 Sendok teh' },
    { id: '5', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Sendok makan' },
    { id: '6', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '7', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '8', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '9', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '10', range: '1 kali, tiap hari', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '11', range: '1 kali, tiap hari', name: 'Mixagrip', dose: '1 Tablet' },
    { id: '12', range: '1 kali, tiap hari', name: 'Ultraflu', dose: '1 Tablet' },
  ]);
  
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-16">
        <Text className="text-3xl text-black font-black">
          Obatku
        </Text>

        <View className="mt-6 p-6 flex-row justify-between items-center bg-amost-primary rounded-lg">
          <View>
            <Text className="text-md font-medium text-white mb-4">
              Total obat saat ini
            </Text>
            <View className='flex-row items-center'>
              <Octicons name="pulse" size={24} style={{ color: `#fff` }} />
              <Text className="text-5xl text-white font-bold ml-4">
                {meds.length}
              </Text>
            </View>
          </View>
          <View>
            <CustomButton
              title="Tambah"
              handlePress={() => router.push("/add-med")}
              containerStyles="py-2 px-4 bg-white"
              textStyles="text-amost-primary text-sm"
              leftIcon="plus"
              iconColor="#00A378"
              />
          </View>
        </View>

        <View className='mt-12 mb-6'>
          <View className='flex-row items-center'>
            <Text className="text-2xl text-amost-secondary-dark_1 font-black">Sedang dikonsumsi</Text>
            <View className='ml-4 bg-amost-secondary-gray_1 rounded-full p-2'>
              <Octicons name="filter" size={16} style={{ color: `#454545` }} />
            </View>
          </View>
        </View>

        <ScrollView className='space-y-3' contentContainerStyle={{ paddingBottom: 250 }}>
          {meds.map(med => (
            <View key={med.id} className='flex-row justify-between p-4 rounded-lg items-center border border-amost-secondary-dark_2'>
              <View>
                <Text className='text-xl font-bold text-black'>{med.name}</Text>
                <View className='flex-row space-x-2'>
                  <Text className='text-sm font-semibold text-amost-secondary-dark_1'>{med.dose}</Text>
                  <View className="flex-1 border-0.5 border-l border-amost-secondary-dark_1"/>
                  <Text className='text-sm font-semibold text-amost-secondary-dark_1'>{med.range}</Text>
                </View>
              </View>
              <View>
                <Octicons name="chevron-right" size={20} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Medication