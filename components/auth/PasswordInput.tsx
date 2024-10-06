import React, { useState } from "react"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Controller, Control } from "react-hook-form"
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from "@/components/ui/icon"

interface PasswordInputProps {
  name: string
  control: Control<any>
  label: string
  placeholder: string
  errors: any
}

const PasswordInput: React.FC<PasswordInputProps> = ({ name, control, label, placeholder, errors }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleVisibility = () => setShowPassword(!showPassword)

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-amost-secondary-dark_1">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input>
            <InputField
              className="text-sm"
              placeholder={placeholder}
              type={showPassword ? "text" : "password"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
            />
            <InputSlot onPress={toggleVisibility} className="pr-3">
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
        )}
      />
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText size="sm">
          {errors[name]?.message}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}

export default PasswordInput
