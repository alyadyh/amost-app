import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons'

const Home = () => {
  const [days, setDays] = useState([
    { id: 1, name: 'Sen', date: '7' },
    { id: 2, name: 'Sel', date: '8' },
    { id: 3, name: 'Rab', date: '9' },
    { id: 4, name: 'Kam', date: '10' },
    { id: 5, name: 'Jum', date: '11' },
    { id: 6, name: 'Sab', date: '12' },
    { id: 7, name: 'Min', date: '13' },
  ]);

  const [meds, setMeds] = useState([
    { id: '1', time: '10.00', name: 'Amoxicilin', dose: '1 Tablet' },
    { id: '2', time: '11.00', name: 'Paracetamol', dose: '2 Tablet' },
    { id: '3', time: '12.00', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '4', time: '12.30', name: 'Ibuprofen', dose: '2 Sendok teh' },
    { id: '5', time: '14.00', name: 'Ibuprofen', dose: '1 Sendok makan' },
    { id: '6', time: '16.00', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '7', time: '16.10', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '8', time: '18.00', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '9', time: '21.00', name: 'Ibuprofen', dose: '1 Tablet' },
    { id: '10', time: '21.00', name: 'Ibuprofen', dose: '1 Tablet' },
  ]);

  return (
    <SafeAreaView className="h-full bg-white">
        <View className="px-6 py-16">
          <View>
            <Text className="text-3xl text-black font-black mb-8">
              Hari ini
            </Text>

            <View className='flex-row justify-between mb-4'>
              {days.map(day => (
                <View key={day.id} className={`items-center px-3 py-2 rounded ${day.name === 'Kam' ? 'bg-amost-primary' : ''}`}>
                  <Text className={`font-bold text-xs ${day.id === 4 ? 'text-white' : 'text-amost-secondary-dark_2'}`}>{day.name}</Text>
                  <Text className={`font-bold text-base ${day.id === 4 ? 'text-white' : 'text-black'}`}>{day.date}</Text>
                </View>
              ))}
            </View>
          </View>

          <ScrollView className='py-6 h-full'>
            {meds.map(med => (
              <View key={med.id} className='p-2'>
                <View className='flex-row items-center mb-1.5'>
                  <Text className='max-w-10 font-medium'>{med.time}</Text>
                  <View className="flex-1 border-dashed border-t border-black ml-4"/>
                </View>
                <View className='flex-row justify-between ml-12 bg-amost-secondary-light_1 p-4 rounded-md items-center border border-amost-primary'>
                  <View>
                    <Text className='text-xl font-bold text-black'>{med.name}</Text>
                    <Text className='text-sm font-semibold text-amost-primary'>{med.dose}</Text>
                  </View>
                  <View>
                    <Octicons name="kebab-horizontal" size={20} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Home