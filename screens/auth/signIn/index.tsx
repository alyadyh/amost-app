import React, { useEffect, useState } from "react"
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
  AlertCircleIcon,
  ArrowLeftIcon,
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
import { Box } from "@/components/ui/box"
import { supabase } from "@/lib/supabase"

const loginSchema = z.object({
  email: z.string().min(1, "Email belum diisi").email(),
  password: z.string().min(1, "Password belum diisi"),
})

type LoginSchemaType = z.infer<typeof loginSchema>

const LoginScreen = ({ isEmailConfirmed }: { isEmailConfirmed: boolean }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  })
  const toast = useToast()
  const [validated, setValidated] = useState({
    emailValid: true,
    passwordValid: true,
  })

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      // Call Supabase's sign-in method
      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (!error) {
        router.push("/home")
      } else {
        // Error occurred: Set validation based on the error message
        if (error.message === "Invalid login credentials") {
          setValidated({ emailValid: true, passwordValid: false })
        } else if (error.message === "User not found") {
          setValidated({ emailValid: false, passwordValid: true })
        } else if (error.message.includes("Invalid email or password")) {
          setValidated({ emailValid: false, passwordValid: false })
        }
      }
    } catch (err) {
      console.error("Error during login:", err)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const handleKeyPress = () => {
    Keyboard.dismiss()
    handleSubmit(onSubmit)()
  }
  const router = useRouter()

  // Show toast if email is confirmed
  useEffect(() => {
    if (isEmailConfirmed) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle className="text-white">Email berhasil dikonfirmasi!</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [isEmailConfirmed])

  return (
    <VStack className="w-full h-full justify-between" space="md">
      <VStack className="md:items-center" space="md">
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
        <VStack space="sm">
          <Heading className="md:text-center text-amost-primary mt-12" size="3xl">
            Halo,
          </Heading>
          <Heading className="md:text-center text-amost-primary" size="2xl">
            Bagaimana kabarmu?
          </Heading>
          <Text className="font-normal text-amost-secondary-dark_2" size="sm">Masuk kembali untuk mengelola obatmu</Text>
        </VStack>
        <VStack space="xl" className="w-full mt-12">
          {/* Email */}
          <FormControl
            isInvalid={!!errors.email || !validated.emailValid}
            className="w-full"
            >
            <FormControlLabel>
              <FormControlLabelText className="font-medium text-amost-secondary-dark_1">Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await loginSchema.parseAsync({ email: value })
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
                {errors?.email?.message ||
                  (!validated.emailValid && "Email tidak ditemukan")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Password */}
          <FormControl
            isInvalid={!!errors.password || !validated.passwordValid}
            className="w-full"
            >
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
                    await loginSchema.parseAsync({ password: value })
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
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText size="sm">
                {errors?.password?.message ||
                  (!validated.passwordValid && "Password tidak valid")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Forgot Password */}
          <Box className="w-full items-end">
            <Link href="/forgotPassword">
              <LinkText className="font-medium text-sm text-amost-secondary-dark_2">
                Lupa Password?
              </LinkText>
            </Link>
          </Box>
        </VStack>
      </VStack>
      <VStack space="md" className="items-center">
        <Button 
          className="bg-amost-primary rounded-full w-full" 
          size="xl"
          onPress={handleSubmit(onSubmit)}>
          <ButtonText className="font-medium text-white">Masuk</ButtonText>
        </Button>
        <HStack className="self-center" space="sm">
          <Text size="md" className="text-amost-secondary-dark_2">Belum punya akun?</Text>
          <Link href="/signUp">
            <LinkText
              className="font-medium text-amost-primary no-underline"
              size="md"
            >
              Daftar
            </LinkText>
          </Link>
        </HStack>
      </VStack>
    </VStack>
  )
}

export const SignIn = ({ isEmailConfirmed }: { isEmailConfirmed: boolean }) => {
  return (
    <AuthLayout>
      <LoginScreen isEmailConfirmed={isEmailConfirmed} />
    </AuthLayout>
  )
}
