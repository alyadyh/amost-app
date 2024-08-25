import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, View, Image, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
import CustomButton from "@/components/CustomButton";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4 bg-white">
          <View className="relative mb-10">
            <Image
              source={require('@/assets/images/onboarding.png')}
              className="w-auto h-auto"
            />
          </View>

          <View className="relative mt-8">
            <Text className="text-3xl text-amost-secondary-dark_1 font-extrabold text-center">
              Kelola Obatmu
            </Text>
            <Text className="text-3xl text-amost-secondary-dark_1 font-extrabold text-center mt-2">
              Bersama{" "}
              <Text className="text-3xl text-amost-primary font-extrabold text-center mt-2">AMOST</Text>
            </Text>
            <Text className="text-base font-medium text-amost-secondary-dark_2 mt-7 text-center">
              Sering lupa minum obat tepat waktu?{"\n"}
              AMOST akan membantu Anda mengelola obat dengan lebih baik.
            </Text>
          </View>
          <View className="mt-12">
            <CustomButton
              title="Mulai Sehat Sekarang"
              handlePress={() => router.push("/sign-in")}
              containerStyles="min-w-80 h-14 mt-7 bg-amost-primary"
              textStyles="text-white"
            />
            <Text className="text-sm text-amost-secondary-dark_1 font-regular text-center mt-2">
              Sudah punya akun?{" "}
              <Link href="/sign-in" className="text-sm text-amost-primary">Masuk</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}