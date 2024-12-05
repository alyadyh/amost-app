import React, { useState } from "react"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPasswordSchema } from "@/schemas/authSchemas"
import { AuthLayout } from "../layout"
import useRouter from "@unitools/router"
import PasswordInput from "@/components/auth/PasswordInput"
import { z } from "zod"
import { useAuth } from "@/lib/supabase"
import { Text } from "@/components/ui/text"
import { HStack } from "@/components/ui/hstack"
import { Pressable } from "@/components/ui/pressable"
import { Heading } from "@/components/ui/heading"
import { ArrowLeftIcon, Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"


type CreatePasswordFormType = z.infer<typeof createPasswordSchema>

const CreatePasswordScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePasswordFormType>({
    resolver: zodResolver(createPasswordSchema),
  })

  const toast = useToast()
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreatePasswordFormType) => {
    if (data.password !== data.confirmpassword) {
      toast.show({
        placement: "top left",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Password tidak sama</ToastTitle>
          </Toast>
        ),
      })
      return
    }

    try {
      setLoading(true)
      const { error } = await updatePassword(data.password)

      if (error) {
        console.error("Update password error:", error)
        toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Gagal mengubah password.</ToastTitle>
          </Toast>
        ),
      })
        setLoading(false)
        return
      }

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Berhasil ubah password</ToastTitle>
          </Toast>
        ),
      })

      reset()
      router.push("/signIn")
    } catch (err) {
      console.error("Error during password reset:", err)
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Terjadi kesalahan saat mengubah password.</ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center" space="3xl">
          <HStack space="md" className="items-center">
            <Pressable
              onPress={() => {
                router.back()
              }}
            >
              <Icon as={ArrowLeftIcon} className="text-amost-secondary-dark_1" size="2xl" />
            </Pressable>
            <Heading size="2xl" className="text-amost-primary font-black">
              Ubah Password
            </Heading>
          </HStack>
          <Text size="md" className="text-amost-secondary-dark_1">
            Password harus berbeda dengan yang telah digunakan sebelumnya.
          </Text>
          <VStack space="3xl">
            <PasswordInput
              name="password"
              control={control}
              label="Password"
              placeholder="Masukkan Password"
              errors={errors}
            />
            <PasswordInput
              name="confirmpassword"
              control={control}
              label="Konfirmasi Password"
              placeholder="Masukkan Password"
              errors={errors}
            />
          </VStack>
        </VStack>
        <VStack className="w-full">
          <VStack className="mt-7 w-full">
            <Button
              className="bg-amost-primary rounded-full w-full"
              size="xl"
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? (
                <Spinner size="small" color="white" />
              ) : (
                <ButtonText className="font-medium">Ubah Password</ButtonText>
              )}
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </AuthLayout>
  )
}

export const CreatePassword = CreatePasswordScreen
