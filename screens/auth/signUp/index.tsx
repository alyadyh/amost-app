import React, { useState } from "react"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { LinkText } from "@/components/ui/link"
import Link from "@unitools/link"
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon"
import { Button, ButtonText } from "@/components/ui/button"
import { Alert, Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pressable } from "@/components/ui/pressable"
import useRouter from "@unitools/router"
import { AuthLayout } from "../layout"
import { supabase } from "@/lib/supabase"

const signUpSchema = z.object({
  fullname: z.string().min(1, "Nama belum diisi"),
  email: z.string().min(1, "Email belum diisi").email(),
  password: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(new RegExp(".*[A-Z].*"), "Minimal harus terdiri dari satu huruf besar")
    .regex(new RegExp(".*[a-z].*"), "Minimal harus terdiri dari satu huruf kecil")
    .regex(new RegExp(".*\\d.*"), "Minimal harus terdiri dari satu angka")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\]:\\\\].*"),
      "Minimal harus terdiri dari satu karakter simbol"
    ),
  confirmpassword: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(new RegExp(".*[A-Z].*"), "Minimal harus terdiri dari satu huruf besar")
    .regex(new RegExp(".*[a-z].*"), "Minimal harus terdiri dari satu huruf kecil")
    .regex(new RegExp(".*\\d.*"), "Minimal harus terdiri dari satu angka")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\]:\\\\].*"),
      "Minimal harus terdiri dari satu karakter simbol"
    ),
  privacyagreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui Kebijakan Privasi dan Syarat Ketentuan",
  }),
})
type SignUpSchemaType = z.infer<typeof signUpSchema>

const SignUpWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  })
  const toast = useToast()

  const onSubmit = async (data: SignUpSchemaType) => {
    if (data.password !== data.confirmpassword) {
      toast.show({
        placement: "top left",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Password tidak cocok</ToastTitle>
          </Toast>
        ),
      })
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullname
          },
          emailRedirectTo: 'amost://confirm-email', // Deep link to the sign-in screen
        },
      })

      if (error) {
        Alert.alert("Sign up failed", error.message)
        return
      }

      toast.show({
        placement: "top left",
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
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }
  const handleConfirmPwState = () => {
    setShowConfirmPassword((showState) => {
      return !showState
    })
  }
  const handleKeyPress = () => {
    Keyboard.dismiss()
    handleSubmit(onSubmit)()
  }
  const router = useRouter()

  return (
    <VStack className="w-full h-full justify-between" space="md">
      <VStack className="md:items-center mb-8" space="sm">
        <Pressable
          onPress={() => {
            router.back()
          }}
        >
          <Icon
            as={ArrowLeftIcon}
            className="md:hidden text-amost-secondary-dark_1"
            size="2xl"
          />
        </Pressable>
        <VStack space="sm" className="mt-6">
          <Heading className="md:text-center text-amost-primary" size="2xl">
            Mulai buat akunmu sekarang!
          </Heading>
          <Text className="font-normal text-amost-secondary-dark_2" size="sm">Daftar untuk mulai mengelola obatmu</Text>
        </VStack>
        <VStack space="md" className="w-full mt-4">
          {/* Full Name Section */}
          <FormControl isInvalid={!!errors.fullname}>
            <FormControlLabel>
              <FormControlLabelText className="font-medium text-amost-secondary-dark_1">
                Nama
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="fullname"
              defaultValue=""
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
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
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText size="sm">
                {errors?.fullname?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Email Section */}
          <FormControl isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText className="font-medium text-amost-secondary-dark_1">Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await signUpSchema.parseAsync({ email: value })
                    return true
                  } catch (error: any) {
                    return error.message
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="email@address.com"
                    type="text"
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
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText size="sm">
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Password Section */}
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText className="font-medium text-amost-secondary-dark_1">Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await signUpSchema.parseAsync({
                      password: value,
                    })
                    return true
                  } catch (error: any) {
                    return error.message
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    className="text-sm"
                    placeholder="******"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertCircleIcon} />
              <FormControlErrorText size="sm">
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Confirm Password Section */}
          <FormControl isInvalid={!!errors.confirmpassword}>
            <FormControlLabel>
              <FormControlLabelText className="font-medium text-amost-secondary-dark_1">Konfirmasi Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="confirmpassword"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await signUpSchema.parseAsync({
                      password: value,
                    })
                    return true
                  } catch (error: any) {
                    return error.message
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="******"
                    className="text-sm"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    type={showConfirmPassword ? "text" : "password"}
                  />

                  <InputSlot onPress={handleConfirmPwState} className="pr-3">
                    <InputIcon
                      as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                    />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertCircleIcon} />
              <FormControlErrorText size="sm">
                {errors?.confirmpassword?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Controller
            name="privacyagreement"
            defaultValue={false}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={!!errors.privacyagreement}>
                <Checkbox
                  value="Privacy Agreement"
                  isChecked={value}
                  onChange={onChange}
                  aria-label="Privacy Agreement"
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
            onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium text-white">Daftar</ButtonText>
          </Button>
          <HStack className="self-center" space="sm">
            <Text size="md" className="text-amost-secondary-dark_2">Sudah punya akun?</Text>
            <Link href="/signIn">
              <LinkText
                className="font-medium text-amost-primary no-underline"
                size="md"
              >
                Masuk
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  )
}

export const SignUp = () => {
  return (
    <AuthLayout>
      <SignUpWithLeftBackground />
    </AuthLayout>
  )
}
