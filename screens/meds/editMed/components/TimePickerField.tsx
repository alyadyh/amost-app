import React, { useState } from "react"
import { Pressable } from "@/components/ui/pressable"
import { FormControl, FormControlError, FormControlLabel, FormControlLabelText, FormControlErrorText } from "@/components/ui/form-control"
import { Input, InputField } from "@/components/ui/input"
import { TimePickerComponent } from "./TimePicker"

// Helper function to ensure value is a Date
const getValidTime = (value: any) => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  } else if (typeof value === "string") {
    // Convert time string (e.g., "11:30") to Date
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  return new Date(); // Default to current time if value is invalid
}

export const TimePickerField = ({ name, label, control, value, setValue, onChange, error }: any) => {
  const [showPicker, setShowPicker] = useState(false)

  const onTimeConfirm = (selectedTime: Date) => {
    setShowPicker(false)
    const timeString = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    onChange(timeString)  // Pass the time string to the parent form
  }

  const validTime = getValidTime(value); // Ensure value is a valid Date or convert it

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-amost-secondary-dark_1">{label}</FormControlLabelText>
      </FormControlLabel>
      <Pressable onPressIn={() => setShowPicker(true)}>
        <Input>
          <InputField
            placeholder="00:00"
            value={value} // Display the value as a string (already in "HH:mm" format)
            editable={false} // Prevent manual input
          />
        </Input>
        {showPicker && (
          <TimePickerComponent
            value={validTime} // Pass the valid Date to the TimePicker
            onConfirm={onTimeConfirm} // Update the form when time is selected
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
