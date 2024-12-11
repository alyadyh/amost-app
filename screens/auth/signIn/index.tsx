// Core dependencies
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Components
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonText } from '@/components/ui/button'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { Spinner } from '@/components/ui/spinner'
import FormInput from '@/components/auth/FormInput'
import PasswordInput from '@/components/auth/PasswordInput'
import AuthHeader from '@/components/auth/AuthHeader'
import AuthFooter from '@/components/auth/AuthFooter'

// Schemas
import { loginSchema } from '@/schemas/authSchemas'

// Utils and Libs
import { useAuth } from '@/lib/supabase'
import useRouter from '@unitools/router'

// Layout
import { AuthLayout } from '../layout'


type LoginFormType = z.infer<typeof loginSchema>

const SignInScreen = ({ isEmailConfirmed }: { isEmailConfirmed: boolean }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  })

  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const router = useRouter()
  const { signIn } = useAuth()

  const [validated, setValidated] = useState({
    emailValid: true,
    passwordValid: true,
  })

  const onSubmit = async (data: LoginFormType) => {
    setIsLoading(true)

    try {
      const { error } = await signIn(data.email, data.password)

      if (!error) {
        router.push("/home")
      } else {
        console.log("Supabase sign-in error:", error)

        // Ensure error.message is a string
        // const errorMessage =
        //   typeof error.message === "string"
        //     ? error.message
        //     : JSON.stringify(error.message)

        // console.log("Toast Error Message:", errorMessage)

        // Display error toast with forced string conversion
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle className="text-white">Login gagal: email atau password invalid</ToastTitle>
            </Toast>
          ),
        })

        // Handle specific validation states for email and password
        if (error.message === "Invalid login credentials") {
          setValidated({ emailValid: false, passwordValid: false })
        }
        // if (error.message === "Invalid login credentials") {
        //   setValidated({ emailValid: true, passwordValid: false })
        // } else if (error.message === "User not found") {
        //   setValidated({ emailValid: false, passwordValid: true })
        // } else if (error.message.includes("Invalid email or password")) {
        //   setValidated({ emailValid: false, passwordValid: false })
        // }
        console.log("setValidated emailValid:", validated.emailValid, "passwordValid:", validated.passwordValid)
      }
    } catch (err) {
      console.error("Unexpected error during login:", err)

      // Generic fallback error toast
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle className="text-white">Terjadi kesalahan saat login.</ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isEmailConfirmed) {
      toast.show({
        placement: "top left",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle className="text-white">Email berhasil dikonfirmasi!</ToastTitle>
          </Toast>
        ),
      })
    }
  }, [isEmailConfirmed])

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center" space="md">
          <AuthHeader
            titleBig="Halo,"
            title="Bagaimana kabarmu?"
            subtitle="Masuk kembali untuk mengelola obatmu"
          />
          <VStack space="xl" className="w-full mt-12">
            <FormInput
              name="email"
              control={control}
              label="Email"
              placeholder="email@address.com"
              errors={errors}
            />
            <PasswordInput
              name="password"
              control={control}
              label="Password"
              placeholder="******"
              errors={errors}
            />
            {/* <VStack className="w-full items-end">
              <Pressable onPress={() => router.push("/forgotPassword")}>
                <Text className="font-medium text-sm text-amost-secondary-dark_2">
                  Lupa Password?
                </Text>
              </Pressable>
            </VStack> */}
          </VStack>
        </VStack>
        <VStack space="md" className="items-center">
          <Button
            className="bg-amost-primary rounded-full w-full"
            size="xl"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <Spinner size="small" color="white" />
            ) : (
              <ButtonText className="font-medium text-white">Masuk</ButtonText>
            )}
          </Button>
          <AuthFooter
            question="Belum punya akun?"
            linkText="Daftar"
            linkTo="/signUp"
          />
        </VStack>
      </VStack>
    </AuthLayout>
  )
}

export const SignIn = SignInScreen
