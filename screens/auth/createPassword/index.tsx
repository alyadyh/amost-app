import { useState } from "react"
import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon"
import { Button, ButtonText } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircleIcon } from "lucide-react-native"
import { Pressable } from "@/components/ui/pressable"
import useRouter from "@unitools/router"
import { AuthLayout } from "../layout"

const createPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(new RegExp(".*[A-Z].*"), "Satu huruf besar")
    .regex(new RegExp(".*[a-z].*"), "Satu huruf kecil")
    .regex(new RegExp(".*\\d.*"), "Satu angka")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\]:\\\\].*"),
      "Satu karakter simbol"
    ),
  confirmpassword: z
    .string()
    .min(6, "Minimal harus terdiri dari 6 karakter")
    .regex(new RegExp(".*[A-Z].*"), "Satu huruf besar")
    .regex(new RegExp(".*[a-z].*"), "Satu huruf kecil")
    .regex(new RegExp(".*\\d.*"), "Satu angka")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\]:\\\\].*"),
      "Satu karakter simbol"
    ),
})

type CreatePasswordSchemaType = z.infer<typeof createPasswordSchema>

const CreatePasswordWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePasswordSchemaType>({
    resolver: zodResolver(createPasswordSchema),
  })
  const toast = useToast()

  const onSubmit = (data: CreatePasswordSchemaType) => {
    if (data.password === data.confirmpassword) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>Berhasil ubah password</ToastTitle>
            </Toast>
          )
        },
      })
      reset()
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Password tidak sama</ToastTitle>
            </Toast>
          )
        },
      })
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
    <VStack className="w-full h-full py-6 justify-between" space="md">
      <VStack className="md:items-center" space="2xl">
        <Pressable
          onPress={() => {
            router.back()
          }}
        >
          <Icon
            as={ArrowLeftIcon}
            className="md:hidden stroke-background-800"
            size="xl"
          />
        </Pressable>
        <VStack space="sm">
          <Heading className="md:text-center" size="2xl">
            Ubah Password
          </Heading>
          <Text className="md:text-center">
            Password harus berbeda dengan yang telah digunakan sebelumnya
          </Text>
        </VStack>
        <VStack space="3xl">
          <FormControl isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await createPasswordSchema.parseAsync({
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
                    placeholder="Masukkan Password"
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
            <FormControlLabel>
              <FormControlLabelText size="sm" className="font-normal text-amost-secondary-dark_2">
                Minimal harus terdiri dari 6 karakter
              </FormControlLabelText>
            </FormControlLabel>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmpassword}>
            <FormControlLabel>
              <FormControlLabelText>Konfirmasi Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="confirmpassword"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await createPasswordSchema.parseAsync({
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
                    placeholder="Masukkan Password"
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
            <FormControlLabel>
              <FormControlLabelText size="sm" className="font-normal text-amost-secondary-dark_2">
                Kedua password harus sama
              </FormControlLabelText>
            </FormControlLabel>
          </FormControl>
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
  )
}

export const CreatePassword = () => {
  return (
    <AuthLayout>
      <CreatePasswordWithLeftBackground />
    </AuthLayout>
  )
}
