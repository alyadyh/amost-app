import React, { useState } from "react"
import { Pressable } from "@/components/ui/pressable"
import { FormControl, FormControlError, FormControlLabel, FormControlLabelText, FormControlErrorText } from "@/components/ui/form-control"
import { Input, InputField } from "@/components/ui/input"
import { TimePickerComponent } from "./TimePicker"

export const TimePickerField = ({ name, label, control, value, setValue, onChange, error }: any) => {
  const [showPicker, setShowPicker] = useState(false)

  const onTimeConfirm = (selectedTime: Date) => {
    setShowPicker(false)
    onChange(selectedTime)  // Notify the parent of the time change
  }

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-amost-secondary-dark_1">{label}</FormControlLabelText>
      </FormControlLabel>
      <Pressable onPressIn={() => setShowPicker(true)}>
        <Input>
          <InputField
            placeholder="00:00"
            value={value ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : ""}
            editable={false} // Prevent manual input
          />
        </Input>
        {showPicker && (
          <TimePickerComponent
            value={value || new Date()}
            onConfirm={onTimeConfirm}
          />
        )}
      </Pressable>
      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  )
}