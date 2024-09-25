import React from "react"
import {
  FormControl,
  FormControlError,
  FormControlLabel,
  FormControlLabelText,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control"
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectContent,
  SelectItem,
  SelectIcon,
  SelectBackdrop,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
} from "@/components/ui/select"
import { Controller } from "react-hook-form"
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon"

export const SelectField = ({ name, label, control, options, error, setValue }: any) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-amost-secondary-dark_1">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            selectedValue={value}
            onValueChange={(val) => {
              console.log(`Selected value: ${val}`) // Check if the correct value is selected

              const selectedOption = options.find((option: any) => option.value === val)
              console.log("Selected Option:", selectedOption)

              if (selectedOption && setValue) {
                // If the `name` is `dosage`, update `doseQuantity`
                if (name === "dosage") {
                  setValue("doseQuantity", selectedOption.doseQuantity)
                  console.log(`Dose Quantity: ${selectedOption.doseQuantity}`)
                }

                // If the `name` is `frequency`, update `frequencyTimesPerDay` and `frequencyIntervalDays`
                if (name === "frequency") {
                  setValue("frequencyTimesPerDay", selectedOption.timesPerDay)
                  setValue("frequencyIntervalDays", selectedOption.intervalDays)
                  console.log(
                    `TimesPerDay: ${selectedOption.timesPerDay}, IntervalDays: ${selectedOption.intervalDays}`
                  )
                }
              }

              // Trigger onChange for the field
              onChange(val)
            }}
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder={`Pilih ${label.toLowerCase()}`} />
              <SelectIcon as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {options.map((option: any) => (
                  <SelectItem key={option.value} label={option.label} value={option.value} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
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
}
