import React, { useState } from "react"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Alert } from "react-native"
import { AlertCircleIcon, Icon } from "@/components/ui/icon"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/schemas/authSchemas"
import { AuthLayout } from "../layout"
import useRouter from "@unitools/router"
import FormInput from "@/components/auth/FormInput"
import PasswordInput from "@/components/auth/PasswordInput"
import AuthHeader from "@/components/auth/AuthHeader"
import AuthFooter from "@/components/auth/AuthFooter"
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control"
import { CheckIcon } from "@/components/ui/icon"
import { useAuth } from "@/lib/supabase"
import { z } from "zod"
import { Spinner } from "@/components/ui/spinner"

type SignUpFormType = z.infer<typeof signUpSchema>

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
  })

  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const router = useRouter()
  const { signUp } = useAuth()

  const onSubmit = async (data: SignUpFormType) => {
    if (data.password !== data.confirmpassword) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Password tidak cocok</ToastTitle>
          </Toast>
        ),
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(data.email, data.password, data.fullname)

      if (error) {
        if (error.status === 400) {
          console.error("Validation error:", error.message);
        } else if (error.status === 500) {
          console.error("Server error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }

      if (error) {
        console.log("Sign up gagal", error.message)
        console.log("Full error details:", error)
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Terjadi kesalahan saat mendaftar. Silakan coba lagi.</ToastTitle>
            </Toast>
          ),
        })
        setIsLoading(false)
        return
      }

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Silakan periksa email Anda untuk verifikasi.</ToastTitle>
          </Toast>
        ),
      })

      reset()
      router.push("/signIn")
    } catch (err) {
      console.error("Error during sign-up:", err)
      toast.show({
        placement: "top",

        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle className="text-white">Terjadi kesalahan saat mendaftar. Silakan coba lagi.</ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <VStack className="w-full h-full justify-between" space="md">
        <VStack className="md:items-center mb-8" space="sm">
          <AuthHeader
            title="Mulai buat akunmu sekarang!"
            subtitle="Daftar untuk mulai mengelola obatmu"
          />
          <VStack space="md" className="w-full mt-4">
            <FormInput
              name="fullname"
              control={control}
              label="Nama"
              placeholder="John Doe"
              errors={errors}
            />
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
            <PasswordInput
              name="confirmpassword"
              control={control}
              label="Konfirmasi Password"
              placeholder="******"
              errors={errors}
            />
            {/* Privacy Agreement */}
            <Controller
              name="privacyagreement"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.privacyagreement}>
                  <Checkbox
                    value="Privacy Agreement"
                    isChecked={value}
                    onChange={onChange}
                    accessibilityLabel="Privacy Agreement"
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel className="text-xs text-amost-secondary-dark_2">
                      Saya menyetujui Kebijakan Privasi serta Syarat dan Ketentuan yang berlaku.
                    </CheckboxLabel>
                  </Checkbox>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText size="sm">
                      {errors?.privacyagreement?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />
          </VStack>
        </VStack>
        <VStack space="xl" className="w-full">
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
                <ButtonText className="font-medium text-white">Daftar</ButtonText>
              )}
            </Button>
            <AuthFooter
              question="Sudah punya akun?"
              linkText="Masuk"
              linkTo="/signIn"
            />
          </VStack>
        </VStack>
      </VStack>
    </AuthLayout>
  )
}

export const SignUp = SignUpScreen
