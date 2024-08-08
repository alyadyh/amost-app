import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Button, GestureResponderEvent } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Octicons from '@expo/vector-icons/Octicons';
// import Accordion from "@/components/Accordion";
import TimePickerComponent from "@/components/TimePicker";
import DropdownComponent from "@/components/Dropdown";

const AddMed = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    medform: "",
    dose: "",
    freq: "",
    time: "",
  });
  
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  function log(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-10">
        <View className="flex-row items-center space-x-8">
          <Link href="/medication">
            <Octicons name="chevron-left" size={35} style={{ color: `#454545` }} />
          </Link>
          <Text className="text-3xl text-black font-black">
            Tambah Obat
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <FormField
              title="Nama Obat"
              value={form.name}
              placeholder="Paracetamol"
              // leftIcon="mail"
              handleChangeText={(e) => setForm({ ...form, name: e })}
              otherStyles="mt-8"
              />
          </View>

          <View>
            <DropdownComponent
              title="Bentuk Obat"
              data={data}
            />
          </View>
          <View>
            <DropdownComponent
              title="Dosis"
              data={data}
            />
          </View>
          <View>
            <DropdownComponent
              title="Frekuensi"
              data={data}
            />
          </View>
          <View>
            <TimePickerComponent title="Waktu" />
          </View>
        </View>

        <View className="mt-6">
          <CustomButton
            title="Tambahkan Obat"
            // handlePress={submit}
            handlePress={() => router.push("/medication")}
            containerStyles="min-w-80 mt-7 bg-amost-primary z-0"
            textStyles="text-white"
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMed;
