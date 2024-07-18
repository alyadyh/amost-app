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
            Senang bertemu
          </Text>
          <Text className="text-4xl text-amost-primary font-extrabold mt-3">
            Anda kembali!
          </Text>
          <Text className="text-sm font-medium text-amost-secondary-dark_2 mt-3">
            Masuk untuk kembali mengelola obatmu
          </Text>

          <View className="flex mt-0">
            <FormField
              title="Email"
              value={form.email}
              placeholder="email@address.com"
              leftIcon="mail"
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-14"
              keyboardType="email-address"
              />

            <FormField
              title="Password"
              value={form.password}
              placeholder="******"
              leftIcon="key"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
             />
          </View>

          <View className="mt-12">
            <CustomButton
              title="Masuk"
              // handlePress={submit}
              handlePress={() => router.push("/home")}
              containerStyles="min-w-80 mt-7 bg-amost-primary"
              textStyles="text-white"
              />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-sm text-amost-secondary-dark_1 font-regular">
                Belum punya akun?
              </Text>
              <Link
                href="/sign-up"
                className="text-sm font-semibold text-amost-primary"
               >
                Daftar
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
