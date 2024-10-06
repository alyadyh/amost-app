import React from "react"
import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Icon, ArrowLeftIcon } from "@/components/ui/icon"
import { router } from "expo-router"
import { Pressable } from "react-native"

interface AuthHeaderProps {
  title: string
  titleBig?: string
  subtitle: string
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, titleBig, subtitle }) => {
  return (
    <VStack space="xl">
        <Pressable onPress={() => router.back()}>
            <Icon as={ArrowLeftIcon} className="md:hidden text-amost-secondary-dark_1 mb-4" size="2xl" />
        </Pressable>
        <VStack space="sm">
            {titleBig && (
                <Heading className="md:text-center text-amost-primary" size="3xl">
                    {titleBig}
                </Heading>
            )}
            <Heading className="md:text-center text-amost-primary" size="2xl">
                {title}
            </Heading>
            <Text className="text-amost-secondary-dark_2">
                {subtitle}
            </Text>
        </VStack>
    </VStack>
  )
}

export default AuthHeader
