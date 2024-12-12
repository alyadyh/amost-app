// Core dependencies
import React, { useEffect, useState } from "react"

// Components
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { Box } from "@/components/ui/box"
import { Pressable } from "@/components/ui/pressable"
import { Button, ButtonText } from "@/components/ui/button"
import { TimePickerComponent } from "../components/TimePicker"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody } from "@/components/ui/modal"

// Icons
import { Check, X } from "lucide-react-native"

// Constants
import { Medicine, Log } from "@/constants/types"

// Utils and Libs
import { format } from "date-fns"

// API
import { fetchLog, updateLog } from "@/api/log"
import { updateMedicine } from "@/api/medicine"

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
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalReady, setIsModalReady] = useState(false)

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const fetchedLog = await fetchLog()
        console.log('Fetched logs:', fetchedLog)

        // Find the log where medicine_id matches
        const matchingLog = fetchedLog?.find(
          log => log.medicine_id === medicine.id && log.reminder_time === reminderTime && log.log_date === logDate
        )
        console.log('Matching log:', matchingLog)
        setLog(matchingLog || null)
      } catch (error) {
        console.error("Error fetching log:", error)
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

  const handleLogUpdate = async (taken: boolean, selectedDateTime?: Date) => {
    if (!log) return
    const log_time = taken && selectedDateTime ? format(selectedDateTime, "HH:mm") : null
    const log_date = taken && selectedDateTime ? format(selectedDateTime, "yyyy-MM-dd") : log.log_date
    await updateLog({ ...log, taken, log_time, log_date })

    const stockChange = taken ? -medicine.dose_quantity : medicine.dose_quantity
    await updateMedicine(medicine.id, { stock_quantity: medicine.stock_quantity + stockChange })

    const updatedLog = { ...log, taken, log_time, log_date }
    onLog(updatedLog)
    onClose()
  }

  // Conditional text based on med_form
  const getMedicineText = (
    med_form: string,
    med_name: string,
    taken: boolean,
    log_date?: string | null,
    log_time?: string | null,
  ) => {
    const takeOrUse = ['cairan', 'kapsul', 'tablet', 'bubuk'].includes(med_form) ? 'minum' : 'pakai'

    if (taken && log_date && log_time) {
      // const formattedDate = format(new Date(updated_at), 'yyyy-MM-dd')
      const formattedTime = log_time ? log_time.slice(0, 5) : "00:00"
      return `${med_name} telah ${takeOrUse} pada ${log_date} pukul ${formattedTime}`
    } else {
      return `Sudah ${takeOrUse} ${med_name}?`
    }
  }

  return (
    <Modal isOpen={visible && isModalReady} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-xl p-6 items-center">
        <ModalHeader>
          <SkeletonText className="h-6 w-64" isLoaded={isLoaded}>
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
            <VStack space='lg'>
              <Button
                size="sm"
                variant="solid"
                className="rounded-full bg-amost-primary"
                onPress={() => setShowTimePicker(true)}
              >
                <ButtonText className="font-normal text-white">Edit Log</ButtonText>
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
              <Pressable onPress={() => setShowTimePicker(true)}>
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
              onConfirm={(selectedDateTime) => {
                handleLogUpdate(true, selectedDateTime)
                setShowTimePicker(false)
              }}
              onCancel={() => setShowTimePicker(false)}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
