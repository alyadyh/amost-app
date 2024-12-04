import React, { useEffect, useState } from "react"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Button, ButtonText } from "@/components/ui/button"
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"
import { Icon, LockIcon } from "@/components/ui/icon"
import { ModalComponent } from "./modal"
import { LogOut, ChevronRightIcon, ShieldAlert, Globe, Bell } from "lucide-react-native"
import { Heading } from "@/components/ui/heading"
import { Pressable } from "@/components/ui/pressable"
import { router } from "expo-router"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser, fetchUserProfile, useAuth } from "@/lib/supabase"
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"
import TabLayout from "../layout"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"
import { ScrollView } from "@/components/ui/scroll-view"
import { RefreshControl } from "@/components/ui/refresh-control"

const ProfileScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState({ name: "", email: "", avatar: "" })
  const [isNotificationEnabled, setNotificationEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchProfile = async () => {
    try {
      const currentUser = await getCurrentUser()

      if (currentUser?.id) {
        const profileData = await fetchUserProfile(currentUser.id)
        console.log('Profile data:', profileData)

        if (profileData) {
          setUser({
            name: profileData.full_name || "No Name",
            email: currentUser.email || "",
            avatar: profileData.avatar_url || "",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoaded(true)
    }
  }

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchProfile()
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Handle the name change from the modal
  const handleUpdateProfile = (newName: string, newAvatar: string) => {
    setUser((prevUser) => ({ ...prevUser, name: newName, avatar: newAvatar }))
  }

  return (
    <>
      <VStack className="flex-1">
        <Heading size="2xl" className="text-amost-secondary-dark_1 font-black mb-8">Profil</Heading>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#00A378"
              colors={['#00A378']}
            />
          }
        >
          <VStack className="h-full w-full pb-8" space="2xl">
            <Box className="md:mt-14 mt-6 w-full md:px-10 md:pt-6 pb-4">
              <VStack space="lg" className="items-center">
                  <Avatar size="xl" className="bg-amost-primary">
                    <Skeleton variant="circular" isLoaded={isLoaded}>
                      <AvatarFallbackText className="text-white">
                        {user.name}
                      </AvatarFallbackText>
                      <AvatarImage
                        source={{ uri: user.avatar }}
                      />
                    </Skeleton>
                  </Avatar>
                <VStack className="gap-1 w-full items-center">
                  <SkeletonText className="h-6 w-32" isLoaded={isLoaded}>
                    <Text size="2xl" bold className="text-dark">{user.name}</Text>
                  </SkeletonText>
                  <SkeletonText className="h-6 w-32" isLoaded={isLoaded}>
                    <Text className="font-normal text-sm text-amost-secondary-dark_1">{user.email}</Text>
                  </SkeletonText>
                </VStack>
                <Button size="sm" variant="outline" onPress={() => setShowModal(true)} className="rounded-full border border-border-300">
                  <ButtonText className="font-normal text-amost-secondary-dark_1">Edit Profil</ButtonText>
                </Button>
              </VStack>
            </Box>

            <VStack space="2xl">
              <Skeleton variant="rounded" className="w-full h-16" isLoaded={isLoaded}>
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
                  <Pressable onPress={() => router.push('/privacyPolicy')}>
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
                  <Pressable onPress={() => router.push('/helpCenter')}>
                    <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
                      <HStack className="items-center" space="md">
                        <Icon as={Globe} className="stroke-amost-secondary-dark_2" />
                        <Text size="lg" className="text-lg text-amost-secondary-dark_1">Pusat Bantuan</Text>
                      </HStack>
                      <Icon as={ChevronRightIcon} className="stroke-amost-secondary-dark_2" />
                    </HStack>
                  </Pressable>
                </VStack>
              </Skeleton>

              <LogOutCard isLoaded={isLoaded} />
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>

      {/* Modal for editing profile */}
      <ModalComponent
        showModal={showModal}
        setShowModal={setShowModal}
        name={user.name}
        avatar={user.avatar}
        onUpdateProfile={handleUpdateProfile}
      />
    </>
  )
}

const LogOutCard = ({ isLoaded }: { isLoaded: boolean }) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const { signOut } = useAuth()
  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/signIn")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleCloseDialog = () => {
    setShowAlertDialog(false)
  }

  const handleConfirmLogout = () => {
    setShowAlertDialog(false)
    handleLogout()
  }

  return (
    <>
      {/* Pressable Logout Button */}
      <Pressable onPress={() => setShowAlertDialog(true)}>
        <Skeleton variant="rounded" className="w-full h-16" isLoaded={isLoaded}>
          <VStack className="py-2 px-4 border rounded-xl border-border-300 justify-between items-center">
            <HStack space="2xl" className="justify-between items-center w-full py-3 px-2">
              <Text size="lg" className="text-amost-secondary-dark_1">Keluar</Text>
              <Icon as={LogOut} className="stroke-amost-secondary-dark_2" />
            </HStack>
          </VStack>
        </Skeleton>
      </Pressable>

      {/* Alert Dialog for Logout Confirmation */}
      <AlertDialog isOpen={showAlertDialog} onClose={handleCloseDialog} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <VStack space='md'>
            <AlertDialogHeader>
              <Heading className="text-amost-secondary-dark_1 font-semibold" size="md">
                Keluar dari akun?
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text size="sm">
                Apakah Anda yakin ingin keluar dari akun? Anda harus masuk kembali untuk mengakses akun Anda.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter className="">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleCloseDialog}
                size="sm"
              >
                <ButtonText>Batalkan</ButtonText>
              </Button>
              <Button size="sm" action="negative" onPress={handleConfirmLogout}>
                <ButtonText>Keluar</ButtonText>
              </Button>
            </AlertDialogFooter>
               </VStack>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


export const Profile = () => {
  return (
    <TabLayout>
      <ProfileScreen />
    </TabLayout>
  )
}
