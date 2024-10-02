import React from "react"
import { View } from "react-native"
import { FormControl, FormControlError, FormControlLabel, FormControlLabelText, FormControlErrorText, FormControlErrorIcon } from "@/components/ui/form-control"
import { Input, InputField } from "@/components/ui/input"
import { Pressable } from "@/components/ui/pressable"
import { Controller } from "react-hook-form"
import { AlertCircleIcon } from "@/components/ui/icon"
import { Image } from "react-native"
import { pickImage } from "./ImagePicker"

export const FormField = ({ name, label, control, error, placeholder, isImagePicker = false, setValue, isNumeric, med }: any) => (
  <FormControl isInvalid={!!error}>
    <FormControlLabel>
      <FormControlLabelText className="font-medium text-amost-secondary-dark_1">{label}</FormControlLabelText>
    </FormControlLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          <Pressable
            onPressIn={async () => {
              if (isImagePicker && setValue) {
                const selectedImageUri = await pickImage()
                if (selectedImageUri) {
                  setValue(name, selectedImageUri)
                }
              }
            }}
          >
            <Input>
              <InputField
                placeholder={placeholder}
                value={value !== null && value !== undefined ? value.toString() : ""}
                onChangeText={(val) => {
                  // If the field is numeric, convert the input to a number
                  if (isNumeric) {
                    const numberValue = val ? parseFloat(val) : null
                    onChange(numberValue)
                  } else {
                    onChange(val || null)
                  }
                }}
                keyboardType={isNumeric ? 'numeric' : 'default'} // Use numeric keyboard if the input is a number
                editable={!isImagePicker}
              />
            </Input>
          </Pressable>

          {/* Display the selected image if available */}
          {value && isImagePicker && (
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Image
                source={{
                  uri: value.includes('http') // Check if it's a URL or local image
                    ? value
                    : `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/med_photos/${value}`,
                }}
                style={{ width: 300, height: 300 }}
              />
            </View>
          )}
        </>
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
