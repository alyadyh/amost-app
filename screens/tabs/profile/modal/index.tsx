import React, { useState, useRef, useEffect } from "react"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@/components/ui/modal"
import { Heading } from "@/components/ui/heading"
import { Center } from "@/components/ui/center"
import { Avatar, AvatarImage, AvatarBadge, AvatarFallbackText } from "@/components/ui/avatar"
import { VStack } from "@/components/ui/vstack"
import { Input, InputField } from "@/components/ui/input"
import { Button, ButtonText } from "@/components/ui/button"
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control"
import { Icon, CloseIcon } from "@/components/ui/icon"
import { Pencil, AlertCircleIcon, PencilLine } from "lucide-react-native"
import { Keyboard } from "react-native"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import * as ImagePicker from "expo-image-picker"
import { supabase } from "@/lib/supabase"
import { Pressable } from "@/components/ui/pressable"

// Define Zod schema for form validation
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
  const [avatarUrl, setAvatarUrl] = useState<string>(avatar) // For preview
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null) // To store selected image URI for upload later
  const [uploading, setUploading] = useState(false)

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: name,
    },
  })

  useEffect(() => {
    // Set avatar from the initial value (profile) if available
    if (avatar) {
      setAvatarUrl(`https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/avatars/${avatar}`)
    }
    reset({ name })
  }, [avatar, name, reset])

  const handleKeyPress = () => {
    Keyboard.dismiss()
  }

  const selectAvatar = async () => {
    try {
      // Open the image picker to select from the gallery
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

      let uploadedAvatarUrl = avatarUrl

      // Only upload the image if a new image was selected
      if (selectedImageUri) {
        const response = await fetch(selectedImageUri)
        const arrayBuffer = await response.arrayBuffer()
        const fileExt = selectedImageUri.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
          })

        if (uploadError) {
          throw uploadError
        }

        uploadedAvatarUrl = data.path // Save the path for later use
      }

      // Update profile with new name and avatar
      onUpdateProfile(_data.name, uploadedAvatarUrl)
      setShowModal(false)
      reset()
    } catch (error) {
      console.error("Error uploading avatar or updating profile:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      finalFocusRef={ref}
      size="md"
    >
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
            <AvatarFallbackText className="text-white">
              {name}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUrl || ""
              }}
            />
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
