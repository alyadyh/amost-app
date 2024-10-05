import React, { useEffect, useState } from 'react'
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody } from '@/components/ui/modal'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { Medicine, Log } from '@/constants/types'
import { Icon } from '@/components/ui/icon'
import { Pressable } from 'react-native'
import { Check, X } from 'lucide-react-native'
import { Box } from '@/components/ui/box'
import { supabase } from '@/lib/supabase'
import { TimePickerComponent } from '../components/TimePicker'
import { format } from 'date-fns'

interface LogMedModalProps {
  visible: boolean
  onClose: () => void
  medicine: Medicine
  reminderTime: string
  logDate: string
  onLog: (log: Log) => void
}

export const LogMedModal: React.FC<LogMedModalProps> = ({
  visible,
  onClose,
  medicine,
  reminderTime,
  logDate,
  onLog
}) => {
  const [log, setLog] = useState<Log | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const { data: logData, error } = await supabase
          .from('med_logs')
          .select('*')
          .eq('medicine_id', medicine.id)
          .eq('log_date', logDate)
          .eq('reminder_time', reminderTime)
          .single()

        if (error) {
          console.error('Error fetching log:', error.message)
        } else {
          setLog(logData || null)
        }
      } catch (error) {
        console.error('Error during log fetch:', error)
      }
    }

    if (visible) fetchLog()
  }, [visible, logDate, reminderTime, medicine.id])

  const handleLogUpdate = async (taken: boolean, newTime?: Date) => {
    if (!log) {
      console.error("No log to update")
      return
    }

    let updatedFields: Partial<Log> = { taken }

    if (taken) {
      if (newTime) {
        // Format the new time to 'HH:mm'
        const formattedTime = format(newTime, "HH:mm")
        updatedFields.log_time = formattedTime
      }
    } else {
      // When setting taken to false, clear log_time
      updatedFields.log_time = null
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        throw new Error("User is not logged in")
      }

      // Update the log in Supabase using the log's ID
      const { error } = await supabase
        .from('med_logs')
        .update(updatedFields)
        .eq('id', log.id)

      if (error) {
        throw new Error(error.message)
      }

      // Update stock based on taken status
      if (log.taken === false && taken === true) {
        await updateStock(medicine, -medicine.dose_quantity) // Decrease stock
      } else if (log.taken === true && taken === false) {
        await updateStock(medicine, medicine.dose_quantity) // Increase stock
      }

      // Prepare the updated log object
      const updatedLog: Log = {
        ...log,
        taken,
        log_time: updatedFields.log_time || log.log_time,
      }

      onLog(updatedLog)
      onClose()
    } catch (error) {
      console.error('Error updating log or stock:', error)
    }
  }

  const updateStock = async (medicine: Medicine, change: number) => {
    const newStockQuantity = medicine.stock_quantity + change
    const { error } = await supabase
      .from('medicines')
      .update({ stock_quantity: newStockQuantity })
      .eq('id', medicine.id)

    if (error) {
      console.error('Error updating stock quantity:', error.message)
    }
  }

  // Conditional text based on med_form
  const getMedicineText = (
    med_form: string,
    med_name: string,
    taken: boolean,
    updated_at?: string | null,
    log_time?: string | null,
  ) => {
    const takeOrUse = ['cairan', 'kapsul', 'tablet', 'bubuk'].includes(med_form) ? 'minum' : 'pakai'
    
    if (taken && updated_at && log_time) {
      const formattedDate = format(new Date(updated_at), 'yyyy-MM-dd')
      const formattedTime = log_time ? log_time.slice(0, 5) : "00:00"
      return `${med_name} telah ${takeOrUse} pada ${formattedDate} pukul ${formattedTime}`
    } else {
      return `Sudah ${takeOrUse} ${med_name}?`
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-xl p-6 items-center">
        <ModalHeader>
          <Text size='md' bold className='text-amost-secondary-dark_1 text-center mb-2'>
            {log && log.taken
              ? getMedicineText(medicine.med_form, medicine.med_name, true, log.log_date, log.log_time)
              : getMedicineText(medicine.med_form, medicine.med_name, false)
            }
          </Text>
        </ModalHeader>

        <ModalBody>
          {log && log.taken ? (
            <VStack space='lg'>
              <Button
                size="sm"
                variant="solid"
                className="rounded-full bg-amost-primary"
                onPress={() => setShowTimePicker(true)}
              >
                <ButtonText className="font-normal text-white">Edit Waktu</ButtonText>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full border border-border-300"
                onPress={() => handleLogUpdate(false)}
              >
                <ButtonText className="font-normal text-amost-secondary-dark_1">Tidak diminum</ButtonText>
              </Button>
            </VStack>
          ) : (
            <HStack space="3xl">
              <Pressable onPress={() => handleLogUpdate(true)}>
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-primary rounded-lg'>
                    <Icon as={Check} size="2xl" className="stroke-amost-primary" />
                  </Box>
                  <Text size="sm" className="text-amost-primary">Sudah</Text>
                </VStack>
              </Pressable>

              <Pressable onPress={() => handleLogUpdate(false)}>
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-secondary-dark_2 rounded-lg'>
                    <Icon as={X} size="2xl" className="stroke-amost-secondary-dark_2" />
                  </Box>
                  <Text size="sm" className="text-amost-secondary-dark_2">Belum</Text>
                </VStack>
              </Pressable>
            </HStack>
          )}
          {showTimePicker && (
            <TimePickerComponent
              value={new Date()}
              onConfirm={(time) => {
                handleLogUpdate(true, time) // Pass the new time to log update
                setShowTimePicker(false)
              }}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}