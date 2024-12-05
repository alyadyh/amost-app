'use client'

import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

interface TimePickerProps {
  value: Date
  onConfirm: (selectedDateTime: Date) => void
  onCancel: () => void
}

export const TimePickerComponent: React.FC<TimePickerProps> = ({ value, onConfirm, onCancel }) => {
  const [date, setDate] = useState<Date | null>(value)
  const [showDatePicker, setShowDatePicker] = useState(true)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      setShowDatePicker(false)
      setShowTimePicker(true) // Show time picker after selecting a date
    } else {
      onCancel() // Handle cancel action for date picker
    }
  }

  const handleTimeChange = (_event: any, selectedTime: Date | undefined) => {
    if (selectedTime && date) {
      const updatedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      )
      onConfirm(updatedDateTime) // Pass the combined date and time
    }
  }

  return (
    <>
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date || value}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={date || value}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </>
  )
}
