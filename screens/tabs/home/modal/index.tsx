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
import { fetchLog, updateLog, updateMedicine } from '@/lib/supabase'
import { router } from 'expo-router'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalReady, setIsModalReady] = useState(false)

  useEffect(() => {
    // Fetch log for this medicine if it exists
    const fetchLogData = async () => {
      try {
        const fetchedLog = await fetchLog()
        console.log('Fetched logs:', fetchedLog)

        const matchingLog = fetchedLog?.find(log =>
          log.medicine_id === medicine.id &&
          log.reminder_time.slice(0, 5) === reminderTime &&
          log.log_date === logDate
        )

        console.log('Matching log:', matchingLog)
        setLog(matchingLog || null)
      } catch (error) {
        console.error('Error fetching log:', error)
      } finally {
        setIsLoaded(true)
        setTimeout(() => setIsModalReady(true), 10)
      }
    }

    if (visible) {
      setIsModalReady(false)
      fetchLogData()
    }

  }, [visible, logDate, reminderTime, medicine.id])

  const handleLog = async (taken: boolean, reminderTime: string) => {
    const now = new Date()
    const log_date = logDate
    const log_time = now.toTimeString().split(' ')[0].slice(0, 5) // Get time in 'HH:mm' format

    try {
      const updatedLog = await updateLog({
        medicine_id: medicine.id,
        med_name: medicine.med_name,
        log_date,
        reminder_time: reminderTime,
        taken,
        log_time,
      })

      if (taken && updatedLog) {
        const newStockQuantity = medicine.stock_quantity - medicine.dose_quantity
        await updateMedicine(medicine.id, { stock_quantity: newStockQuantity })
      }

      if (updatedLog) {
        onLog(updatedLog) // Update log state in parent component
        setLog(updatedLog) // Set updated log in local state
      }
    } catch (err) {
      console.error('Error updating log:', err)
    }

    onClose()
  }

  // Conditional text based on medForm
  const getMedicineText = (med_form: string, med_name: string, taken: boolean, log_date?: string | null, log_time?: string | null) => {
    const takeOrUse = ['cairan', 'kapsul', 'tablet', 'bubuk'].includes(med_form) ? 'minum' : 'pakai'

    if (taken && log_date && log_time) {
      // If the medicine is already taken
      const formattedTime = log_time ? log_time.slice(0, 5) : "00:00"
      return `${med_name} telah ${takeOrUse} pada ${log_date} pukul ${formattedTime}`
    } else {
      // If not taken
      return `Sudah ${takeOrUse} ${med_name}?`
    }
  }

  return (
    <Modal isOpen={visible && isModalReady} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-xl p-6 items-center">
        <ModalHeader>
          <SkeletonText className="h-6 w-64 text-center" isLoaded={isLoaded}>
            <Text size='md' bold className='text-amost-secondary-dark_1 text-center mb-2'>
              {log && log.taken
                ? getMedicineText(medicine.med_form, medicine.med_name, true, log.log_date, log.log_time)
                : getMedicineText(medicine.med_form, medicine.med_name, false)
              }
            </Text>
          </SkeletonText>
        </ModalHeader>

        <ModalBody>
          {!isLoaded ? (
            <Skeleton variant="rounded" className="w-full h-20" />
          ) : log && log.taken ? (
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                router.push('/logMed')
                onClose()
              }}
              className="rounded-full border border-border-300"
            >
              <ButtonText className="font-normal text-amost-secondary-dark_1">Edit Log</ButtonText>
            </Button>
          ) : (
            <HStack space="3xl">
              <Pressable onPress={() => handleLog(true, reminderTime)}>
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-primary rounded-lg'>
                    <Icon as={Check} size="2xl" className="stroke-amost-primary" />
                  </Box>
                  <Text size="sm" className="text-amost-primary">Sudah</Text>
                </VStack>
              </Pressable>

              <Pressable onPress={() => handleLog(false, reminderTime)}>
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
