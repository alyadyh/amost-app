import React from "react"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Alert } from "react-native" // Ensure Alert is imported from react-native
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPasswordSchema } from "@/schemas/authSchemas"
import { AuthLayout } from "../layout"
import useRouter from "@unitools/router"
import PasswordInput from "@/components/auth/PasswordInput"
import AuthHeader from "@/components/auth/AuthHeader"
import { z } from "zod"
import { updatePassword } from "@/utils/SupaLegend"


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
      const { error } = await updatePassword(data.password)

      if (error) {
        Alert.alert("Gagal Mengubah Password", error.message)
        return
      }

      toast.show({
        placement: "top left",
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
        placement: "top left",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Terjadi kesalahan saat mengubah password.</ToastTitle>
          </Toast>
        ),
      })
    }
  }

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center" space="2xl">
          <AuthHeader
            title="Ubah Password"
            subtitle="Password harus berbeda dengan yang telah digunakan sebelumnya"
          />
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
              <ButtonText className="font-medium">Ubah Password</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </AuthLayout>
  )
}

export const CreatePassword = CreatePasswordScreen
