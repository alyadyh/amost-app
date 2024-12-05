import React from "react"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control"
import { Input, InputField } from "@/components/ui/input"
import { Controller, Control } from "react-hook-form"
import { AlertCircleIcon } from "@/components/ui/icon"

interface FormInputProps {
  name: string
  control: Control<any>
  label: string
  placeholder: string
  type?: 'text' | 'password'
  errors: any
}

const FormInput: React.FC<FormInputProps> = ({ name, control, label, placeholder, type = "text", errors }) => {
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
              type={type}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
            />
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

export default FormInput
