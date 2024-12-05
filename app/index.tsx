import React from "react"
import { Button, ButtonText } from "@/components/ui/button"
import { router } from "expo-router"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { Image } from "@/components/ui/image"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"

const Index = () => {
  return (
    <SafeAreaView className="bg-white items-center justify-center w-full h-full">
      <VStack space="xl" className="items-center">
        {/* Image Section */}
        <Image
          source={require("../assets/images/onboarding.png")}
          alt="Onboarding Image"
          size="2xl"
          resizeMode="contain"
        />

        {/* Text Section */}
        <VStack space="xs" className="items-center">
          <Text className="text-3xl font-extrabold text-amost-secondary-dark_1">
            Kelola Obatmu
          </Text>
          <HStack space="md" className="items-center">
            <Text className="text-3xl font-extrabold text-amost-secondary-dark_1">
              Bersama
            </Text>
            <Text className="text-3xl font-extrabold text-amost-primary">
              AMOST
            </Text>
          </HStack>
          <Text className="font-medium text-amost-secondary-dark_2 mt-4 tracking-wide text-center leading-relaxed">
            Sering lupa minum obat tepat waktu?{"\n"}
            AMOST akan ingatkan!
          </Text>
        </VStack>
        {/* Button Section */}
        <Button
          className="bg-amost-primary rounded-full mt-10"
          size="xl"
          onPress={() => {
            router.push("/signIn")
          }}
        >
          <ButtonText className="text-white">Mulai Sehat Sekarang</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  )
}

export default Index
