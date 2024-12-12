// Core dependencies
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Components
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonText } from '@/components/ui/button'
import FormInput from '@/components/auth/FormInput'
import AuthHeader from '@/components/auth/AuthHeader'
import { useCustomToast } from "@/components/useCustomToast"

// Schemas
import { forgotPasswordSchema } from '@/schemas/authSchemas'

// Api
import { checkIfEmailExists, useAuth } from '@/api/auth'

// Layout
import { AuthLayout } from '../layout'


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

  const showToast = useCustomToast()
  const { resetPasswordForEmail } = useAuth()

  const onSubmit = async (data: ForgotPasswordFormType) => {
    // if (data.password !== data.confirmpassword) {
    //   toast.show({
    //     placement: "top",
    //     render: ({ id }) => (
    //       <Toast nativeID={id} variant="solid" action="error">
    //         <ToastTitle>Password tidak cocok</ToastTitle>
    //       </Toast>
    //     ),
    //   })
    //   return
    // }

    try {
      // Check if email exists
      const emailExists = await checkIfEmailExists(data.email)

      if (!emailExists) {
        showToast("Email tidak ditemukan. Silakan cek kembali.", "error")
        return
      }

      // Proceed with password reset
      const { error } = await resetPasswordForEmail(data.email)

      if (error) {
        console.error("Reset password error:", error.message)
        showToast("Gagal mengirim link reset password. Silakan coba lagi.", "error")
        return
      }

      // Show success toast
      showToast("Link reset password telah dikirim ke email Anda.", "success")
      reset()
    } catch (err) {
      console.error("Error during password reset:", err)
      showToast("Terjadi kesalahan saat mengirim link reset password.", "error")
    }
  }

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center" space="md">
          <AuthHeader
            title="Lupa Password?"
            subtitle="Masukkan email beserta password baru."
          />
          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="email@address.com"
            errors={errors}
          />
          {/* <PasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="******"
            errors={errors}
          />
          <PasswordInput
            name="confirmpassword"
            control={control}
            label="Konfirmasi Password"
            placeholder="******"
            errors={errors}
          /> */}
        </VStack>

        <Button
          className="bg-amost-primary rounded-full w-full"
          size="xl"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText className="font-medium text-white">Reset Password</ButtonText>
        </Button>
      </VStack>
    </AuthLayout>
  )
}

export const ForgotPassword = ForgotPasswordScreen
