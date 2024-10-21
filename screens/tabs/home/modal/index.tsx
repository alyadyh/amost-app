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
import { insertOrUpdateLog, fetchLogs, updateMedicine, getUserId } from '@/utils/SupaLegend'
import { router } from 'expo-router'

interface LogModalProps {
  visible: boolean
  onClose: () => void
  medicine: Medicine
  reminderTime: string
  logDate: string
  onLog: (log: Log) => void
}

export const LogModal: React.FC<LogModalProps> = ({ visible, onClose, medicine, reminderTime, logDate, onLog }) => {
  const [log, setLog] = useState<Log | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch log using the utility function from supalegend
  const loadLog = async () => {
    try {
      const userId = getUserId()
      if (!userId) {
        throw new Error('User is not logged in')
      }

      const logs = fetchLogs()
      const fetchedLog = logs?.find(
        (entry) =>
          entry.medicine_id === medicine.id &&
          entry.log_date === logDate &&
          entry.reminder_time === reminderTime
      )

      setLog(fetchedLog || null)
    } catch (error) {
      console.error('Error fetching log:', error)
    }
  }

  useEffect(() => {
    if (visible && reminderTime && logDate) {
      loadLog()
    }
  }, [visible, reminderTime, logDate])

  const handleLog = async (taken: boolean) => {
    try {
      const userId = getUserId()
      if (!userId) {
        throw new Error('User is not logged in')
      }

      const logData: Log = {
        id: log?.id || '',
        medicine_id: medicine.id,
        log_date: logDate,
        reminder_time: reminderTime,
        taken,
        log_time: new Date().toTimeString().slice(0, 5),  // Current time in 'HH:mm'
        user_id: userId,
        created_at: log?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        med_name: medicine.med_name,
        deleted: log?.deleted || false
      }

      // Insert or update log using the utility function from SupaLegend
      insertOrUpdateLog(logData)

      // Update stock if the medicine is taken
      if (taken) {
        const newStockQuantity = medicine.stock_quantity - medicine.dose_quantity
        await updateMedicine(medicine.id, { stock_quantity: newStockQuantity })
      }

      // Pass updated log to parent
      onLog(logData)
      onClose()

    } catch (error) {
      console.error('Error handling log:', error)
    }
  }

  // Conditional text based on medForm
  const getMedicineText = (med_form: string, med_name: string, taken: boolean, log_date?: string | null, log_time?: string | null) => {
    const takeOrUse = ['cairan', 'kapsul', 'tablet', 'bubuk'].includes(med_form) ? 'minum' : 'pakai'
    const formattedTime = log_time ? log_time.slice(0, 5) : "00:00"

    if (taken && log_date && log_time) {
      // If the medicine is already taken
      return `${med_name} telah ${takeOrUse} pada ${log_date} pukul ${formattedTime}`
    } else {
      // If not taken
      return `Sudah ${takeOrUse} ${med_name}?`
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-xl p-6 items-center">
        <ModalHeader>
          <Text size='md' bold className='text-amost-secondary-dark_1 text-center mb-2'>
            {log && log.taken && log.log_date === logDate
              ? getMedicineText(medicine.med_form, medicine.med_name, true, log.log_date, log.log_time)
              : getMedicineText(medicine.med_form, medicine.med_name, false)
            }
          </Text>
        </ModalHeader>

        <ModalBody>
          {log && log.taken && log.log_date === logDate ? (
            <Button
              size="sm"
              variant="outline"
              onPress={() => router.push('/logMed')}
              className="rounded-full border border-border-300"
            >
              <ButtonText className="font-normal text-amost-secondary-dark_1">Edit Log</ButtonText>
            </Button>
          ) : (
            <HStack space="3xl">
              <Pressable onPress={() => handleLog(true)}>
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-primary rounded-lg'>
                    <Icon as={Check} size="2xl" className="stroke-amost-primary" />
                  </Box>
                  <Text size="sm" className="text-amost-primary">Sudah</Text>
                </VStack>
              </Pressable>

              <Pressable onPress={() => handleLog(false)}>
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-secondary-dark_2 rounded-lg'>
                    <Icon as={X} size="2xl" className="stroke-amost-secondary-dark_2" />
                  </Box>
                  <Text size="sm" className="text-amost-secondary-dark_2">Belum</Text>
                </VStack>
              </Pressable>
            </HStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
