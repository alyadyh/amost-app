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

  // Fetch log for this medicine if it exists
  const fetchLog = async (reminderTime: string, logDate: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('med_logs')
        .select('*')
        .eq('medicine_id', medicine.id)
        .eq('reminder_time', reminderTime)
        .eq('log_date', logDate)
        .limit(1)
      
      if (error) {
        console.error('Error fetching log:', error.message)
      } else if (data && data.length > 0) {
        setLog(data[0])
      } else {
        setLog(null)
      }
    } catch (err) {
      console.error('Error during log fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible && reminderTime && logDate) {
      fetchLog(reminderTime, logDate) // Ensure logDate matches fullDate from UI
    }
  }, [visible, reminderTime, logDate])

  const handleLog = async (taken: boolean, reminderTime: string) => {
    const now = new Date()
    const log_date = logDate; // Use the prop
    const log_time = now.toTimeString().split(' ')[0].slice(0, 5) // Get time in 'HH:mm' format

    try {
      // Retrieve the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) {
        throw new Error('User is not logged in')
      }

      // Perform upsert
      const { data, error } = await supabase
        .from('med_logs')
        .upsert([{
          user_id: sessionData.session.user.id,
          medicine_id: medicine.id,
          log_date,
          reminder_time: reminderTime,
          taken,
          log_time,
        }], {
          onConflict: 'user_id,medicine_id,log_date,reminder_time',
        })
        .select()

      if (error) {
        console.error('Error upserting log:', error.message)
      } else if (data && data.length > 0) {
        const upsertedLog: Log = data[0]

        // Update stock quantity if the medicine was taken
        if (taken) {
          const newStockQuantity = medicine.stock_quantity - medicine.dose_quantity
          const { error: updateError } = await supabase
            .from('medicines')
            .update({ stock_quantity: newStockQuantity })
            .eq('id', medicine.id)

          if (updateError) {
            console.error('Error updating stock quantity:', updateError.message)
          }
        }

        // Pass the complete log to the parent component and update local state
        onLog(upsertedLog)
        setLog(upsertedLog)
      }
    } catch (err) {
      console.error('Error logging medicine:', err)
    }

    onClose()
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