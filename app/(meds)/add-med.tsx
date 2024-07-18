import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Octicons from '@expo/vector-icons/Octicons';
import { Icon, Input } from '@rneui/themed'

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View
          className="flex w-full h-full px-8 pt-12 bg-white"
        >
          <Text className="text-4xl text-amost-primary font-extrabold mt-12">
            Tambah Obat
          </Text>

          <View className="mt-12">
            <CustomButton
              title="Masuk"
              // handlePress={submit}
              handlePress={() => router.push("/medication")}
              containerStyles="min-w-80 mt-7 bg-amost-primary"
              textStyles="text-white"
              />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
