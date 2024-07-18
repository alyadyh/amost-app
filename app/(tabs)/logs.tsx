import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Octicons, MaterialIcons } from '@expo/vector-icons'

const Logs = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-16">
        <Text className="text-3xl text-black font-black mb-8">
          Log
        </Text>

          <View className="mt-0 space-x-0">
            <View className='p-6 bg-amost-primary rounded-t-lg'>
              <Text className="text-md font-medium text-white mb-4">
                Angka kepatuhan hari ini
              </Text>
              <View className='flex-row items-center'>
                <Text className="text-5xl text-white font-bold ml-4">
                  87
                </Text>
                <MaterialIcons name="percent" size={24} color="white" />
              </View>
            </View>

            <View className='flex-row justify-center items-center bg-amost-secondary-light_1 border border-amost-primary space-x-3 p-6 rounded-b-lg'>
              <Text className='text-base text-amost-primary'>Lihat semua log</Text>
              <Octicons name="chevron-right" size={20} color="#00A378" />
            </View>
          </View>

          <View className='mt-6 p-6 flex-row justify-between items-center border border-amost-secondary-dark_2 rounded-lg'>
            <View className='flex-row items-center space-x-6'>
              <View>
                <Octicons name="download" size={28} color="#6E6E6E" />
              </View>
              <View>
                <Text className='font-bold text-lg'>Kirim Laporan Obat</Text>
                <Text className='text-xs text'>Berbagi catatan obatmu dengan dokter</Text>
              </View>
            </View>
            <View>
              <Octicons name="chevron-right" size={28} color="#000" />
            </View>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default Logs