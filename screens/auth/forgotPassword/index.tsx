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
import { Input, InputField } from "@/components/ui/input"
import { AlertCircleIcon, ArrowLeftIcon, Icon } from "@/components/ui/icon"
import { Button, ButtonText } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import useRouter from "@unitools/router"
import { Pressable } from "@/components/ui/pressable"
import { AuthLayout } from "../layout"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
})

type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const toast = useToast()

  const onSubmit = (_data: forgotPasswordSchemaType) => {
    toast.show({
      placement: "bottom right",
      render: ({ id }) => {
        return (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Link telah terkirim ke email anda</ToastTitle>
          </Toast>
        )
      },
    })
    reset()
  }

  const handleKeyPress = () => {
    Keyboard.dismiss()
    handleSubmit(onSubmit)()
  }
  const router = useRouter()

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
            Lupa Password?
          </Heading>
          <Text className="text-sm font-normal text-amost-secondary-dark_2">
            Masukkan email yang terkait dengan akun Anda.
          </Text>
        </VStack>
        <FormControl isInvalid={!!errors?.email} className="w-full mt-6">
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
                  await forgotPasswordSchema.parseAsync({ email: value })
                  return true
                } catch (error: any) {
                  return error.message
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
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
            <FormControlErrorText>
              {errors?.email?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>

      <Button 
        className="bg-amost-primary rounded-full w-full" 
        size="xl"
        onPress={handleSubmit(onSubmit)}
      >
        <ButtonText className="font-medium text-white">Kirim Link</ButtonText>
      </Button>
    </VStack>
  )
}

export const ForgotPassword = () => {
  return (
    <AuthLayout>
      <ForgotPasswordScreen />
    </AuthLayout>
  )
}
