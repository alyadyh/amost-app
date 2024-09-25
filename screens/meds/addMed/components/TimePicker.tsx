'use client'

import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

export const TimePickerComponent = ({ value, onConfirm }: { value: Date, onConfirm: (time: Date) => void }) => {
  const onChange = (_event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || value
    onConfirm(currentTime)
  }

  return (
    <>
      <DateTimePicker
         testID="dateTimePicker"
         value={value || new Date()}
         mode="time"
         is24Hour={true}
         display="default"
         onChange={(event, selectedDate) => onChange(event, selectedDate)}
      />
    </>
  )
}
