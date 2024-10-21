import React, { useState, useRef, useEffect } from "react"
import { Keyboard } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Heading } from "@/components/ui/heading"
import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/vstack"
import { Input, InputField } from "@/components/ui/input"
import { Button, ButtonText } from "@/components/ui/button"
import { Icon, CloseIcon } from "@/components/ui/icon"
import { Avatar, AvatarImage, AvatarBadge, AvatarFallbackText } from "@/components/ui/avatar"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@/components/ui/modal"
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control"
import { Pencil, AlertCircleIcon } from "lucide-react-native"
import { Pressable } from "@/components/ui/pressable"
import { Controller, useForm } from "react-hook-form"
import { uploadImage, updateUserProfile, currentUser$ } from "@/utils/SupaLegend"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(50, "Nama harus kurang dari 50 karakter")
})

type userSchemaDetails = z.infer<typeof userSchema>

export const ModalComponent = ({
  showModal,
  setShowModal,
  name,
  avatar,
  onUpdateProfile,
}: {
  showModal: boolean
  setShowModal: any
  name: string
  avatar: string
  onUpdateProfile: (newName: string, newAvatar: string) => void
}) => {
  const ref = useRef(null)
  const [avatarUrl, setAvatarUrl] = useState<string>(avatar)
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { control, formState: { errors }, handleSubmit, reset } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: name,
    },
  })

  useEffect(() => {
    if (avatar) {
      setAvatarUrl(avatar)
    }
    reset({ name })
  }, [avatar, name, reset])

  const handleKeyPress = () => {
    Keyboard.dismiss()
  }

  const selectAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enable editing (cropping)
        aspect: [1, 1], // Set the crop frame to a 1:1 aspect ratio
        quality: 1,
      })

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri
        setAvatarUrl(uri) // Immediately show the selected image
        setSelectedImageUri(uri) // Store URI for upload after clicking "Simpan"
      }
    } catch (error) {
      console.error("Error selecting avatar:", error)
    }
  }

  const onSubmit = async (_data: userSchemaDetails) => {
    try {
      setUploading(true)

      const currentUser = currentUser$.get()

      if (!currentUser) {
        console.error("User is not logged in");
        return;
      }

      let uploadedAvatarUrl = avatarUrl
      let updateData: { full_name?: string, avatar_url?: string } = {}

      // If the user has selected a new avatar, upload it and update the avatar field
      if (selectedImageUri) {
        const uploadedPath = await uploadImage(selectedImageUri, "avatars")
        if (uploadedPath) {
          uploadedAvatarUrl = uploadedPath
          updateData.avatar_url = uploadedPath
        }
      }

      // If the user has changed the full name, update the full_name field
      if (_data.name !== name) {
        updateData.full_name = _data.name
      }

      // If either the avatar or full name has changed, update the user's profile
      if (Object.keys(updateData).length > 0) {
        await updateUserProfile(updateData.full_name ?? name, uploadedAvatarUrl)
        onUpdateProfile(updateData.full_name ?? name, uploadedAvatarUrl)
      }

      setShowModal(false)
      reset()
    } catch (error) {
      console.error("Error uploading avatar or updating profile:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} finalFocusRef={ref} size="md">
      <ModalBackdrop />
      <ModalContent className="bg-background-500 bg-white">
        <ModalHeader className="w-full justify-between items-center mb-4">
          <Heading size="xl" className="text-amost-secondary-dark_1 p-4">
            Edit Profil
          </Heading>
          <ModalCloseButton onPress={() => setShowModal(false)}>
            <Icon as={CloseIcon} size="xl" className="stroke-amost-secondary-dark_1" />
          </ModalCloseButton>
        </ModalHeader>

        <Center className="w-full">
          <Avatar size="xl" className="bg-amost-primary">
            <AvatarFallbackText className="text-white">{name}</AvatarFallbackText>
            <AvatarImage source={{ uri: avatarUrl || "" }} />
            <AvatarBadge size="2xl" className="items-center justify-center bg-amost-secondary-dark_1">
              <Pressable onPress={selectAvatar}>
                <Icon as={Pencil} size="xs" className="stroke-white" />
              </Pressable>
            </AvatarBadge>
          </Avatar>
        </Center>

        <ModalBody className="p-6">
          <VStack space="2xl">
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel className="mb-2">
                <FormControlLabelText className="text-amost-secondary-dark_1">Nama</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="John Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} size="md" />
                <FormControlErrorText>{errors?.name?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button onPress={handleSubmit(onSubmit)} className="rounded-full">
              <ButtonText className="text-white">Simpan</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
