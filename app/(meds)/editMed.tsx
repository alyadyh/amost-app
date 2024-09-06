import React, { useState, useEffect } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Octicons from '@expo/vector-icons/Octicons';
import TimePickerComponent from "@/components/TimePicker";
import DropdownComponent from "@/components/Dropdown";
import ImagePickerComponent from '@/components/ImagePicker';

const EditMed = () => {
  const { med: medString } = useLocalSearchParams();  // Get passed data
  const med = medString ? JSON.parse(medString as string) : null;

  const [isDetailVisible, setDetailVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  
  // Initialize form state with default values (only set once if med is available)
  const [form, setForm] = useState({
    medName: "",
    medForm: "",
    dosage: "",
    frequency: "",
    frequencyTimesPerDay: 1,
    frequencyIntervalDays: 1,
    reminderTimes: [""],
    duration: "",
    stockQuantity: 0,
    instructions: "",
    prescribingDoctor: "",
    dispensingPharmacy: "",
    imageUri: "",
  });

  useEffect(() => {
    console.log('EditMed useEffect called with med:', med);
    if (med) {
      setForm(med);
    }
    // Empty dependency array ensures this runs only once
  }, []);   

  const medFormOptions = [
    { label: 'Cairan', value: 'cairan' },
    { label: 'Kapsul', value: 'kapsul' },
    { label: 'Tablet', value: 'tablet' },
    { label: 'Suntikan', value: 'suntikan' },
    { label: 'Bubuk', value: 'bubuk' },
    { label: 'Patch', value: 'patch' },
    { label: 'Gel', value: 'gel' },
  ];

  const dosageOptions = [
    { label: '1 sendok makan', value: '1 sendok makan' },
    { label: '1 sendok teh', value: '1 sendok teh' },
  ];

  const frequencyOptions = [
    { label: '1x sehari', value: '1x sehari', timesPerDay: 1, intervalDays: 1 },
    { label: '3x sehari', value: '3x sehari', timesPerDay: 3, intervalDays: 1 },
    { label: '1x per 3 hari', value: '1x per 3 hari', timesPerDay: 1, intervalDays: 3 },
  ];

  const durationOptions = [
    { label: '1 minggu', value: '7' },
    { label: '1 bulan', value: '30' },
    { label: '2 bulan', value: '60' },
    { label: '1 tahun', value: '360' },
  ];

  const handleFormChange = (key: keyof typeof form, value: any) => {
    if (form[key] !== value) {
      setForm(prevForm => ({ ...prevForm, [key]: value }));
    }
  };  
  

  const handleFrequencyChange = (selectedOption: any) => {
    handleFormChange("frequency", selectedOption.value);
    handleFormChange("frequencyTimesPerDay", selectedOption.timesPerDay ?? 1);
    handleFormChange("frequencyIntervalDays", selectedOption.intervalDays ?? 1);
  };

  const toggleDetailVisibility = () => {
    setDetailVisible(prev => !prev);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Replace this with your actual database update logic
      await updateMedicationInDatabase(form);
      router.push("/medication");
    } catch (error) {
      console.error("Error updating medication:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 pt-10 pb-24">
        <View className="flex-row items-center space-x-8 bg-white pb-4">
          <TouchableOpacity activeOpacity={0.7}>
            <Link href="/medication">
              <View className="bg-amost-secondary-gray_1 px-4 py-1 items-center justify-center rounded-full">
                <Octicons name="chevron-left" size={35} style={{ color: "#454545" }} />
              </View>
            </Link>
          </TouchableOpacity>

          <Text className="text-3xl text-black font-black">
            Edit Obat
          </Text>
        </View>

        <ScrollView className="space-y-4">
          <View>
            <FormField
              title="Nama Obat"
              value={form.medName}
              placeholder="Paracetamol"
              handleChangeText={(e) => handleFormChange("medName", e)}
              otherStyles="mt-8"
            />
          </View>

          <View>
            <DropdownComponent
              title="Bentuk Obat"
              data={medFormOptions}
              onChange={(value) => handleFormChange("medForm", value)}
              value={form.medForm}
              />
          </View>

          <View>
            <DropdownComponent
              title="Dosis"
              data={dosageOptions}
              onChange={(value) => handleFormChange("dosage", value)}
              value={form.dosage}
              />
          </View>

          <View>
            <DropdownComponent
              title="Frekuensi"
              data={frequencyOptions}
              onChange={handleFrequencyChange}
              value={form.frequency}
              />
          </View>

          <View>
            <DropdownComponent
              title="Durasi"
              data={durationOptions}
              onChange={(value) => handleFormChange("duration", value)}
              value={form.duration}
            />
          </View>

          <View>
            <FormField
              title="Kuantitas Stok"
              value={form.stockQuantity.toString()}
              placeholder="12"
              handleChangeText={(e) => handleFormChange("stockQuantity", e)}
            />
          </View>

          <View>
            <TimePickerComponent
              title="Waktu Pengingat"
              onConfirm={(time) => handleFormChange("reminderTimes", [time])}
              value={form.reminderTimes[0] ? form.reminderTimes[0] : ''} 
             />
          </View>

          {isDetailVisible && (
            <View className="space-y-4">
              <View>
                <FormField
                  title="Instruksi"
                  value={form.instructions}
                  placeholder="Lebih baik dikonsumsi setelah makan"
                  handleChangeText={(e) => handleFormChange("instructions", e)}
                />
              </View>

              <View>
                <FormField
                  title="Dokter Yang Meresepkan"
                  value={form.prescribingDoctor}
                  placeholder="Dr. John Doe"
                  handleChangeText={(e) => handleFormChange("prescribingDoctor", e)}
                />
              </View>

              <View>
                <FormField
                  title="Apotek"
                  value={form.dispensingPharmacy}
                  placeholder="Apotek ABC"
                  handleChangeText={(e) => handleFormChange("dispensingPharmacy", e)}
                />
              </View>

              <View>
                <ImagePickerComponent
                  title="Foto Obat"
                  value={form.imageUri}
                  onImageSelect={(uri) => handleFormChange("imageUri", uri)}
                />
              </View>
            </View>
          )}

          <View>
            <CustomButton
              title="Opsional"
              handlePress={toggleDetailVisibility}
              containerStyles="max-w-32 bg-amost-secondary-orange_3"
              textStyles="text-white text-base font-medium ml-1"
              leftIcon={!isDetailVisible ? "chevron-down" : "chevron-up"}
              iconColor="#ffff"
            />
          </View>

          <View className="mt-14">
            <CustomButton
              title="Simpan Perubahan"
              handlePress={handleSubmit}
              containerStyles="min-w-80 mt-7 bg-amost-primary"
              textStyles="text-white"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditMed;

function updateMedicationInDatabase(
  form: { 
    medName: string; 
    medForm: string; 
    dosage: string; 
    frequency: string; 
    frequencyTimesPerDay: number; 
    frequencyIntervalDays: number; 
    reminderTimes: string[]; 
    duration: string; 
    stockQuantity: number; 
    instructions: string; 
    prescribingDoctor: string; 
    dispensingPharmacy: string; 
    imageUri: string; 
  }) {
    throw new Error("Function not implemented.");
}
