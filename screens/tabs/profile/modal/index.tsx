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

// Define Zod schema for form validation
const userSchema = z.object({
  name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters")
})

type userSchemaDetails = z.infer<typeof userSchema>

export const ModalComponent = ({
  showModal,
  setShowModal,
  name,
  onUpdateName,
}: {
  showModal: boolean
  setShowModal: any
  name: string
  onUpdateName: (newName: string) => void
}) => {
  const ref = useRef(null)
  const { control, formState: { errors }, handleSubmit, reset } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: name,
    },
  })

  useEffect(() => {
    reset({ name })
  }, [name, reset])

  const handleKeyPress = () => {
    Keyboard.dismiss()
  }

  const onSubmit = (_data: userSchemaDetails) => {
    onUpdateName(_data.name)
    setShowModal(false)
    reset()
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
