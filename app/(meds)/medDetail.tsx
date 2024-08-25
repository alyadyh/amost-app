import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import { MedicationDetailRouteProp } from '@/components/navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Link } from 'expo-router';
import { Feather, Octicons } from '@expo/vector-icons';

type Props = {
  route: MedicationDetailRouteProp;
};

const MedicationDetail: React.FC<Props> = () => {
  const route = useRoute<MedicationDetailRouteProp>()
  const { med } = route.params

  if (!med) {
    return <Text>Error: No medication details available.</Text>;
  }
  
  const [medication, setMedication] = useState({
    name: med.name,
    schedule: {
      frequency: '1 time, Daily',
      firstIntake: '12:00',
      duration: 'Finish on Aug 30',
    },
    dosage: med.dose,
    formAndColor: '',
    prescribed: false,
    stockQuantity: '',
    conditions: '',
    doctor: '',
    pharmacy: ''
  });

  useEffect(() => {
    setMedication({
      ...medication,
      name: med.name,
      dosage: med.dose,
    });
  }, [med]);

  return (
    <SafeAreaView className="h-full bg-amost-primary">
      <View className="px-6 py-16">
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
          <View className="bg-amost-primary p-4">
            <View className="flex items-center">
              <Text className="text-2xl font-bold">{medication.name}</Text>
            </View>
            <View className="mt-4">
              <Text className="text-lg font-bold">Jadwal</Text>
              <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                <Text>{medication.schedule.frequency}</Text>
                <Text className="mt-2">1st intake: {medication.schedule.firstIntake}</Text>
                <Text className="mt-2">Duration: {medication.schedule.duration}</Text>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-lg font-bold">Dosis</Text>
              <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                <Text>Dosage: {medication.dosage}</Text>
                <Text className="mt-2">Form & Color: {medication.formAndColor}</Text>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-lg font-bold">Info Obat</Text>
              <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                <TouchableOpacity className="mt-2">
                  <Text>Photos</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-2">
                  <Text>Instructions</Text>
                </TouchableOpacity>
                <View className="mt-2 flex-row justify-between items-center">
                  <Text>Set as prescribed med</Text>
                  <Switch
                    value={medication.prescribed}
                    onValueChange={(value) => setMedication({ ...medication, prescribed: value })}
                    />
                </View>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-lg font-bold">Atur Stok</Text>
              <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                <TouchableOpacity className="mt-2">
                  <Text>Quantity of Stock</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-lg font-bold">Detail Obat</Text>
              <View className="bg-gray-100 p-4 mt-2 rounded-lg">
                <TouchableOpacity className="mt-2">
                  <Text>Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-2">
                  <Text>Prescribing Doctor</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-2">
                  <Text>Dispensing Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity className="mt-4 bg-red-500 p-4 rounded-lg">
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MedicationDetail;
