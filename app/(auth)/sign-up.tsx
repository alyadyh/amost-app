import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex w-full h-full px-8 pt-12 bg-white">
              <Text className="text-4xl text-amost-primary font-extrabold mt-12">
                Mulai buat akunmu!
              </Text>
              <Text className="text-sm font-medium text-amost-secondary-dark_2 mt-3">
                Daftar untuk mulai mengelola obatmu
              </Text>

              <View className="flex mt-0">
                <FormField
                  title="Email"
                  value={form.email}
                  placeholder="Masukkan email Anda"
                  handleChangeText={(e) => setForm({ ...form, email: e })}
                  otherStyles="mt-14"
                  keyboardType="email-address"
                />

                <FormField
                  title="Password"
                  value={form.password}
                  placeholder="Masukkan password Anda"
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles="mt-7"
                  secureTextEntry
                />

                <FormField
                  title="Konfirmasi Password"
                  value={form.confirmPassword}
                  placeholder="Masukkan password Anda"
                  handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                  otherStyles="mt-7"
                  secureTextEntry
                />
              </View>

              <View className="mt-12">
                <CustomButton
                  title="Daftar"
                  handlePress={() => router.push("/sign-up")}
                  containerStyles="min-w-80 mt-7 bg-amost-primary"
                  textStyles="text-white"
                  isLoading={isSubmitting}
                />

                <View className="flex justify-center pt-5 flex-row gap-2">
                  <Text className="text-sm text-amost-secondary-dark_1 font-regular">
                    Sudah punya akun?
                  </Text>
                  <Link
                    href="/sign-in"
                    className="text-sm font-semibold text-amost-primary"
                  >
                    Masuk
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUp;
