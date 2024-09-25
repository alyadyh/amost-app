import React from 'react'
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody } from '@/components/ui/modal'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { Button, ButtonText } from '@/components/ui/button'
import { Medicine, Log } from '@/constants/types'
import { Icon, CloseIcon, CheckIcon } from '@/components/ui/icon'
import { ButtonIcon } from '@/components/ui/button'
import { Pressable } from 'react-native'
import { Check, SquareCheck, SquareCheckBig, X } from 'lucide-react-native'
import { Box } from '@/components/ui/box'

interface LogModalProps {
  visible: boolean
  onClose: () => void
  medicine: Medicine
  onLog: (log: Log) => void
}

export const LogModal: React.FC<LogModalProps> = ({ visible, onClose, medicine, onLog }) => {
  const handleLog = (taken: boolean) => {
    const now = new Date()
    const date = now.toISOString().split('T')[0] // Get date in 'YYYY-MM-DD' format
    const time = now.toTimeString().split(' ')[0].slice(0, 5) // Get time in 'HH:mm' format

    const log: Log = {
      id: medicine.id,
      date, // Store date separately
      time, // Store time separately
      taken,
    }

    console.log("Log being stored:", log) // Check the log data
    onLog(log)
    onClose()
  }

  // Conditional text based on medForm
  const getMedicineText = (medForm: string, medName: string) => {
    const takeOrUse = ['cairan', 'kapsul', 'tablet', 'bubuk'].includes(medForm) ? 'minum' : 'pakai'
    return `Sudah ${takeOrUse} ${medName}?`
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-xl p-6 items-center">
        <ModalHeader>
          <Text size='md' bold className='text-amost-secondary-dark_1 text-center mb-2'>
            {getMedicineText(medicine.medForm, medicine.medName)}
          </Text>
        </ModalHeader>

        <ModalBody>
          <HStack space="3xl">
            <Pressable
              onPress={() => handleLog(true)}
              >
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-primary rounded-lg'>
                    <Icon as={Check} size="2xl" className="stroke-amost-primary" />
                  </Box>
                  <Text size="sm" className="text-amost-primary">Sudah</Text>
                </VStack>
            </Pressable>

            <Pressable
              onPress={() => handleLog(false)}
              >
                <VStack space='sm' className='items-center'>
                  <Box className='p-2 border-2 border-amost-secondary-dark_2 rounded-lg'>
                    <Icon as={X} size="2xl" className="stroke-amost-secondary-dark_2" />
                  </Box>
                  <Text size="sm" className="text-amost-secondary-dark_2">Belum</Text>
                </VStack>
            </Pressable>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
