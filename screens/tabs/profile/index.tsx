import React, { useEffect, useState } from "react"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"
import { Icon, LockIcon } from "@/components/ui/icon"
import { ModalComponent } from "./modal"
import { Bolt, LogOut, ChevronRightIcon, ShieldAlert, Globe, EditIcon, type LucideIcon, Bell } from "lucide-react-native"
import { Heading } from "@/components/ui/heading"
import { Pressable } from "@/components/ui/pressable"
import { router } from "expo-router"
import { USERS } from "@/data/dummy"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Switch } from "@/components/ui/switch"

interface AccountCardType {
    iconName: LucideIcon | typeof Icon
    subText: string
    rightIcon: LucideIcon | typeof Icon
}

export const Profile = () => {
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState({ name: "", email: "" })
  const [isNotificationEnabled, setNotificationEnabled] = useState(false)

  useEffect(() => {
    const currentUser = USERS[0]
    setUser(currentUser)
  }, [])

  // Handle the name change from the modal
  const handleUpdateName = (newName: string) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }))
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="px-6 py-16">
        <Heading size="2xl" className="text-amost-secondary-dark_1 font-black mb-8">Profil</Heading>
        <VStack className="h-full w-full pb-8" space="2xl">
          <Box className="md:mt-14 mt-6 w-full md:px-10 md:pt-6 pb-4">
            <VStack space="lg" className="items-center">
              {/* <Avatar size="2xl" className="bg-primary-600">
                <AvatarImage alt="Profile Image" source={require("@/assets/images/profile-screens/profile/image.png")} />
              </Avatar> */}
              <Avatar size="xl" className="bg-amost-primary">
                <AvatarFallbackText className="text-white">
                  {user.name}
                </AvatarFallbackText>
              </Avatar>
              <VStack className="gap-1 w-full items-center">
                <Text size="2xl" bold className="text-dark">{user.name}</Text>
                <Text className="font-normal text-sm text-amost-secondary-dark_1">{user.email}</Text>
              </VStack>
              <Button size="sm" variant="outline" onPress={() => setShowModal(true)} className="rounded-full border border-border-300">
                <ButtonText className="font-normal text-amost-secondary-dark_1">Edit Profil</ButtonText>
              </Button>
            </VStack>
          </Box>

          <VStack space="2xl">
            {/* Render Account Cards manually */}
            <VStack className="py-2 px-4 border rounded-xl border-border-300 justify-between items-center">
              {/* Notifikasi Row with Switch */}
              <HStack space="2xl" className="justify-between items-center w-full py-0.5 px-2">
                <HStack className="items-center" space="md">
                  <Icon as={Bell} className="stroke-amost-secondary-dark_2" />
                  <Text size="lg" className="text-lg text-amost-secondary-dark_1">Notifikasi</Text>
                </HStack>
                <Switch
                  trackColor={{ false: '#6E6E6E', true: '#00A378' }}
                  thumbColor={'#EFEFEF'}
                  ios_backgroundColor={'#6E6E6E'}
                  onValueChange={() => setNotificationEnabled(!isNotificationEnabled)}
                  value={isNotificationEnabled}
                />
              </HStack>

              <Divider className="my-1" />

              {/* Password Row */}
              <Pressable onPress={() => router.push('/createPassword')}>
                <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
                  <HStack className="items-center" space="md">
                    <Icon as={LockIcon} className="stroke-amost-secondary-dark_2" />
                    <Text size="lg" className="text-lg text-amost-secondary-dark_1">Ubah Password</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>

              <Divider className="my-1" />

              {/* Privasi Row */}
              <Pressable>
                <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
                  <HStack className="items-center" space="md">
                    <Icon as={ShieldAlert} className="stroke-amost-secondary-dark_2" />
                    <Text size="lg" className="text-lg text-amost-secondary-dark_1">Kebijakan Privasi</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>

              <Divider className="my-1" />

              {/* Help Center Row */}
              <Pressable>
                <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
                  <HStack className="items-center" space="md">
                    <Icon as={Globe} className="stroke-amost-secondary-dark_2" />
                    <Text size="lg" className="text-lg text-amost-secondary-dark_1">Pusat Bantuan</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>
            </VStack>

            <LogOutCard />
          </VStack>
        </VStack>
      </ScrollView>

      {/* Modal for editing profile */}
      <ModalComponent 
        showModal={showModal} 
        setShowModal={setShowModal}
        name={user.name}
        onUpdateName={handleUpdateName}
      />
    </SafeAreaView>
  )
}

// Component for rendering the log-out card
const LogOutCard = () => {
  const handleLogout = async () => {
    try {
      // Clear any authentication/session data
      await AsyncStorage.removeItem('userToken') // Assuming 'userToken' is stored in AsyncStorage
      console.log("User signed out successfully")

      // Redirect to the sign-in screen after logging out
      router.push('/signIn')
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <Pressable onPress={handleLogout}>
      <VStack className="py-2 px-4 border rounded-xl border-border-300 justify-between items-center">
        <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
          <Text size="lg" className="text-amost-secondary-dark_1">Keluar</Text>
          <Icon as={LogOut} className="stroke-amost-secondary-dark_2" />
        </HStack>
      </VStack>
    </Pressable>
  )
}