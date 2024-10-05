'use client'

import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

interface TimePickerProps {
  value: Date
  onConfirm: (time: Date) => void
}

export const TimePickerComponent: React.FC<TimePickerProps> = ({ value, onConfirm }) => {
  const onChange = (_event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || value
    onConfirm(currentTime)
  }

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={value}
      mode="time"
      is24Hour={true}
      display="default"
      onChange={onChange}
    />
  )
}
