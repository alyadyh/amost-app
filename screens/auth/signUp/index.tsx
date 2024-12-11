// Core dependencies
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Components
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonText } from '@/components/ui/button'
import { Icon, AlertCircleIcon, CheckIcon } from '@/components/ui/icon'
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@/components/ui/form-control'
import { Spinner } from '@/components/ui/spinner'
import FormInput from '@/components/auth/FormInput'
import PasswordInput from '@/components/auth/PasswordInput'
import AuthHeader from '@/components/auth/AuthHeader'
import AuthFooter from '@/components/auth/AuthFooter'

// Schemas
import { signUpSchema } from '@/schemas/authSchemas'

// Utils and Libs
import { useAuth } from '@/lib/supabase'
import useRouter from '@unitools/router'

// Layout
import { AuthLayout } from '../layout'
import { useCustomToast } from '@/components/useCustomToast'


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

  const showToast = useCustomToast()
  const router = useRouter()
  const { signUp } = useAuth()

  // Handle case where required data is missing
  useEffect(() => {
    if (!control) {
      showToast("Terjadi kesalahan saat memuat form. Silakan coba lagi.", "error")
    }
  }, [control])

  const onSubmit = async (data: SignUpFormType) => {
    if (data.password !== data.confirmpassword) {
      showToast("Password tidak cocok. Silakan periksa kembali.", "error")
      return
    }
    setIsLoading(true)

    try {
      const { error } = await signUp(data.email, data.password, data.fullname)

      if (error) {
        if (error.status === 400) {
          console.error("Validation error:", error.message)
        } else if (error.status === 500) {
          console.error("Server error:", error.message)
        } else {
          console.error("Unknown error:", error)
        }
      }

      if (error) {
        console.error("Sign-up error:", error.message)
        showToast("Terjadi kesalahan saat mendaftar. Silakan coba lagi.", "error")
        setIsLoading(false)
        return
      }

      showToast("Silakan periksa email Anda untuk verifikasi.", "success")
      reset()
      router.push("/signIn")
    } catch (err) {
      console.error("Error during sign-up:", err)
      showToast("Terjadi kesalahan saat mendaftar. Silakan coba lagi.", "error")
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
