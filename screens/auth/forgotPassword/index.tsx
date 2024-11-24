import React from "react"
import { useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema } from "@/schemas/authSchemas"
import { AuthLayout } from "../layout"
import useRouter from "@unitools/router"
import FormInput from "@/components/auth/FormInput"
import AuthHeader from "@/components/auth/AuthHeader"
import { Toast, ToastTitle } from "@/components/ui/toast"
import { checkIfEmailExists, useAuth } from "@/lib/supabase"
import { z } from "zod"

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const toast = useToast()
  const router = useRouter()
const { resetPasswordForEmail } = useAuth()

  const onSubmit = async (data: ForgotPasswordFormType) => {
    try {
      // Check if email exists
      const emailExists = await checkIfEmailExists(data.email)

      if (!emailExists) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Email tidak ditemukan</ToastTitle>
            </Toast>
          ),
        })
        return
      }

      // Proceed with password reset
      const { error } = await resetPasswordForEmail(data.email)

      if (error) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>{error.message}</ToastTitle>
            </Toast>
          ),
        })
        return
      }

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Link telah terkirim ke email anda</ToastTitle>
          </Toast>
        ),
      })

      reset()
    } catch (err) {
      console.error("Error during password reset:", err)
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Terjadi kesalahan saat mengirim link reset password.</ToastTitle>
          </Toast>
        ),
      })
    }
  }

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center" space="md">
          <AuthHeader
            title="Lupa Password?"
            subtitle="Masukkan email yang terkait dengan akun Anda."
          />
          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="email@address.com"
            errors={errors}
          />
        </VStack>

        <Button
          className="bg-amost-primary rounded-full w-full"
          size="xl"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText className="font-medium text-white">Kirim Link</ButtonText>
        </Button>
      </VStack>
    </AuthLayout>
  )
}

export const ForgotPassword = ForgotPasswordScreen
