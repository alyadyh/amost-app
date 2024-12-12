'use client'

import React from "react"
import { FormControl, FormControlError, FormControlLabel, FormControlLabelText, FormControlErrorText, FormControlErrorIcon } from "@/components/ui/form-control"
import { Textarea, TextareaInput } from "@/components/ui/textarea"
import { Controller } from "react-hook-form"
import { AlertCircleIcon } from "@/components/ui/icon"

export const TextareaField = ({ name, label, control, error, placeholder }: any) => (
  <FormControl isInvalid={!!error}>
    <FormControlLabel>
      <FormControlLabelText className="font-medium text-amost-secondary-dark_1">{label}</FormControlLabelText>
    </FormControlLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Textarea size="md" className="w-full">
          <TextareaInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
          />
        </Textarea>
      )}
    />
    {error && (
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    )}
  </FormControl>
)
