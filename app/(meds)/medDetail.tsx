import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, SafeAreaView, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Link,useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

type MedForm = 'cairan' | 'kapsul' | 'tablet' | 'suntikan' | 'bubuk' | 'patch' | 'gel';

const images = {
  cairan: require('@/assets/images/medForm/liquid.png'),
  kapsul: require('@/assets/images/medForm/capsule.png'),
  tablet: require('@/assets/images/medForm/tablet.png'),
  suntikan: require('@/assets/images/medForm/injection.png'),
  bubuk: require('@/assets/images/medForm/powder.png'),
  patch: require('@/assets/images/medForm/patch.png'),
  gel: require('@/assets/images/medForm/gel.png'),
};

const MedDetail = () => {
  const [visibleModal, setVisibleModal] = useState<string | null>(null);
  const { med: medString } = useLocalSearchParams();
  const med = medString ? JSON.parse(medString as string) : null;

  if (!med) {
    return <Text>Error: No medication details available.</Text>;
  }

  const medImage = images[med.medForm as MedForm] || images['cairan'];

  const toggleModal = (modalName: string | null) => {
    setVisibleModal(modalName);
  };

  return (
    <SafeAreaView className="h-full bg-amost-primary">
      <View className="px-6 py-14">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            activeOpacity={0.7}
            >
            <Link href="/medication">
              <View className=" px-4 py-1 items-center justify-center rounded-full">
                <Octicons name="chevron-left" size={35} style={{ color: `#ffff` }} />
              </View>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            >
            <Link href="/medication">
              <View className=" px-4 py-1 items-center justify-center rounded-full">
                <Feather name="edit-2" size={24} style={{ color: `#ffff` }} />
              </View>
            </Link>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {/* PNG Image */}
          <View className="items-center mb-2">
            <Image source={medImage} style={{ width: 70, height: 70 }} />
          </View>
          
          {/* Medication Title */}
          <Text className="text-3xl text-white font-black text-center mb-8">
            {med.medName}
          </Text>

          {/* Frequency and Duration */}
          <View className="flex-row justify-between mb-6">
            <View className="flex-1 bg-white rounded-lg mr-1.5 p-4">
              <Text className="text-base font-medium text-amost-secondary-dark_2 mb-2">Frekuensi</Text>

              <View className='flex-row items-center'>
                <MaterialCommunityIcons name="clock-time-four-outline" size={24} color="#00A378" />
                <Text className="text-base font-semibold text-black ml-2">{med.frequencyTimesPerDay}x</Text>
                <Text className='text-base font-semibold text-black ml-1'>
                  {med.frequencyIntervalDays === 1
                    ? "sehari"
                    : med.frequencyIntervalDays === 7
                    ? "seminggu"
                    : `tiap ${med.frequencyIntervalDays} hari`}
                </Text>
              </View>
            </View>
            <View className="flex-1 bg-white rounded-lg ml-1.5 p-4">
              <Text className="text-base font-medium text-amost-secondary-dark_2 mb-2">Durasi</Text>

              <View className='flex-row items-center'>
                <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#00A378" />
                <Text className="text-base font-semibold text-black ml-2">{med.duration}</Text>
              </View>
            </View>
          </View>

          {/* Intake Schedule */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-2">Jadwal</Text>
            {med.reminderTimes.map((time: any, index: any) => (
              <View
                key={index}
                className={`bg-white rounded-lg p-4 ${index === time.length - 1 && index > 0 ? 'mb-0' : 'mb-2'}`}
              >
                <View className="flex-row justify-between">
                  <Text className="text-black font-semibold">
                    {`Asupan ke-${index + 1}`}
                  </Text>
                  <Text className="text-black font-bold">{time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Medication Info */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-2">Info Obat</Text>
            <View className="bg-white rounded-lg p-4 mb-2">
              <View className="flex-row justify-between">
                <Text className="text-black font-semibold">Dosis</Text>
                <Text className="text-black font-bold">{med.dosage}</Text>
              </View>
            </View>
            <View className="bg-white rounded-lg px-4 py-2 mb-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-black font-semibold">Bentuk Obat</Text>
                <Image source={medImage} style={{ width: 30, height: 30 }} />
              </View>
            </View>
            <View className="bg-white rounded-lg p-4">
              <View className="flex-row justify-between">
                <Text className="text-black font-semibold">Jumlah stok obat</Text>
                <Text className="text-black font-bold">{med.stockQuantity}</Text>
              </View>
            </View>
          </View>

          {/* Detail Obat Section */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-2">Detail Obat</Text>

            {/* Foto Section */}
            <TouchableOpacity onPress={() => toggleModal('foto')}>
              <View className="bg-white rounded-lg p-4 mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-black font-semibold">Foto</Text>
                  <Octicons name="chevron-right" size={20} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Instruksi Section */}
            <TouchableOpacity onPress={() => toggleModal('instruksi')}>
              <View className="bg-white rounded-lg p-4 mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-black font-semibold">Instruksi</Text>
                  <Octicons name="chevron-right" size={20} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Dokter yang Meresepkan Section */}
            <TouchableOpacity onPress={() => toggleModal('dokter')}>
              <View className="bg-white rounded-lg p-4 mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-black font-semibold">Dokter yang Meresepkan</Text>
                  <Octicons name="chevron-right" size={20} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Apotek Pembelian Obat Section */}
            <TouchableOpacity onPress={() => toggleModal('apotek')}>
              <View className="bg-white rounded-lg p-4">
                <View className="flex-row justify-between">
                  <Text className="text-black font-semibold">Apotek Pembelian Obat</Text>
                  <Octicons name="chevron-right" size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Delete Button */}
          <TouchableOpacity className="bg-red rounded-full p-3 items-center mt-6 mb-6">
            <Text className="text-white font-bold">Hapus</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal Component */}
        <Modal
          visible={visibleModal !== null}
          transparent={true}
          animationType="none"
          onRequestClose={() => toggleModal(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => toggleModal(null)}
            className="flex-1 justify-center items-center bg-black/50"
          >
            <TouchableWithoutFeedback>
              <View className="bg-white p-4 rounded-xl w-80 relative">
                {/* <TouchableOpacity onPress={() => toggleModal(null)} className="absolute top-2 right-4">
                  <Octicons name="x" size={24} style={{ color: "black" }} />
                </TouchableOpacity> */}
                
                {/* Render Modal Content Based on visibleModal */}
                {visibleModal === 'foto' && (
                  <>
                    <Text className="text-black font-bold my-4 text-center">Foto</Text>
                    {med.medPhotos && med.medPhotos.map((photo: any, index: number) => (
                      <Image key={index} source={{ uri: photo }} style={{ width: 100, height: 100, marginBottom: 10 }} />
                    ))}
                  </>
                )}
                {visibleModal === 'instruksi' && (
                  <>
                    <Text className="text-black font-bold my-4 text-center">Instruksi Obat</Text>
                    <Text className="text-black text-center text-base mb-4">{med.instructions}</Text>
                  </>
                )}
                {visibleModal === 'dokter' && (
                  <>
                    <Text className="text-black font-bold my-4 text-center">Dokter yang Meresepkan Obat</Text>
                    <Text className="text-black text-center text-base mb-4">{med.prescribingDoctor}</Text>
                  </>
                )}
                {visibleModal === 'apotek' && (
                  <>
                    <Text className="text-black font-bold my-4 text-center">Apotek Tempat Membeli Obat</Text>
                    <Text className="text-black text-center text-base mb-4">{med.dispensingPharmacy}</Text>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MedDetail;
