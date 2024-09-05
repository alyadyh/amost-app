import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Octicons from '@expo/vector-icons/Octicons';
import TimePickerComponent from "@/components/TimePicker";
import DropdownComponent from "@/components/Dropdown";
import ImagePickerComponent from '@/components/ImagePicker';

const AddMed = () => {
  // const handleSubmit = async () => {
  //   setSubmitting(true);
  
  //   const medicationData = {
  //     medName: form.medName,
  //     medForm: form.medForm,
  //     dosage: form.dosage,
  //     frequency: form.frequency, // Save the label as frequency
  //     frequencyTimesPerDay: form.frequencyTimesPerDay,
  //     frequencyIntervalDays: form.frequencyIntervalDays,
  //     reminderTimes: form.reminderTimes,
  //     duration: form.duration,
  //     stockQuantity: form.stockQuantity,
  //     instructions: form.instructions,
  //     prescribingDoctor: form.prescribingDoctor,
  //     dispensingPharmacy: form.dispensingPharmacy,
  //   };
  
  //   try {
  //     // Replace this with your actual database save logic
  //     await saveMedicationToDatabase(medicationData);
  //     router.push("/medication");
  //   } catch (error) {
  //     console.error("Error saving medication:", error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  
  const [isDetailVisible, setDetailVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    medName: "",
    medForm: "",
    dosage: "",
    frequency: "",
    frequencyTimesPerDay: 1,
    frequencyIntervalDays: 1,
    reminderTimes: [""],
    duration: "",
    stockQuantity: "",
    instructions: "",
    prescribingDoctor: "",
    dispensingPharmacy: "",
    imageUri: "",
  });

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
    { label: '500 mg', value: '500 mg' },
    { label: '1000 mg', value: '1000 mg' },
    // Add more options as needed
  ];
  
  const frequencyOptions = [
    { label: '1x sehari', value: { label: '1x sehari', timesPerDay: 1, intervalDays: 1 } },
    { label: '3x sehari', value: { label: '3x sehari', timesPerDay: 3, intervalDays: 1 } },
    { label: '1x per 3 hari', value: { label: '1x per 3 hari', timesPerDay: 1, intervalDays: 3 } },
    // Add more options as needed
  ];   
  
  const durationOptions = [
    { label: '1 minggu', value: '7' },
    { label: '1 bulan', value: '30' },
    { label: '2 bulan', value: '60' },
    { label: '1 tahun', value: '360' },
    // Add more options as needed
  ];

  const handleFormChange = (key: string, value: any) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }));
  };

  const handleFrequencyChange = (selectedOption: any) => {
    handleFormChange("frequency", selectedOption.value.label || "");
    handleFormChange("frequencyTimesPerDay", selectedOption.value.timesPerDay ?? 1);
    handleFormChange("frequencyIntervalDays", selectedOption.value.intervalDays ?? 1);
  };

  const toggleDetailVisibility = () => {
    setDetailVisible(prev => !prev);
  };

  const handleImageSelect = (uri: string) => {
    handleFormChange('imageUri', uri); // Save the selected image URI in form state
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
            Tambah Obat
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
              />
          </View>

          <View>
            <DropdownComponent
              title="Dosis"
              data={dosageOptions}
              onChange={(value) => handleFormChange("dosage", value)}
              />
          </View>

          <View>
            <DropdownComponent
              title="Frekuensi"
              data={frequencyOptions}
              onChange={handleFrequencyChange}
              />
          </View>

          {/* Additional fields for duration, instructions, etc. */}
          {isDetailVisible && (
            <View className="space-y-4">
              <View>
                <DropdownComponent
                  title="Durasi"
                  data={durationOptions}
                  onChange={(value) => handleFormChange("duration", value)}
                />
              </View>

              <View>
                <FormField
                  title="Kuantitas Stok"
                  value={form.stockQuantity}
                  placeholder="12"
                  handleChangeText={(e) => handleFormChange("stockQuantity", e)}
                />
              </View>

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
                <TimePickerComponent
                  title="Waktu Pengingat"
                  onConfirm={(time) => handleFormChange("reminderTimes", [time])}
                />
              </View>

              <View>
                <ImagePickerComponent onImageSelect={handleImageSelect} />
                {form.imageUri ? <Text>Image Selected: {form.imageUri}</Text> : null}
              </View>
            </View>
          )}

          {/* Button to show or hide additional fields */}
          <View>
            <CustomButton
              title={isDetailVisible ? "Tanpa Detail" : "Detail Opsional"}
              handlePress={toggleDetailVisibility}
              containerStyles="w-full border border-amost-secondary-dark_2"
              textStyles="text-amost-secondary-dark_2 text-base font-medium ml-1"
              leftIcon={!isDetailVisible ? "chevron-down" : undefined}
              iconColor="#6E6E6E"
            />
          </View>

          <View className="mt-6">
            <CustomButton
              title="Tambahkan Obat"
              handlePress={() => router.push("/medication")}
              containerStyles="min-w-80 mt-7 bg-amost-primary"
              textStyles="text-white"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddMed;
