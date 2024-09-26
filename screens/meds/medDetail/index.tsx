import React, { useState } from 'react'
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"
import { Pressable } from '@/components/ui/pressable'
import { Icon } from '@/components/ui/icon'
import { Button, ButtonText } from '@/components/ui/button'
import { ArrowLeftIcon, Pencil, ChevronRightIcon, CalendarRange, Clock, PencilLine } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { ModalComponent } from "./modal"
import { MedForm, medFormActive } from '@/constants/types'
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Heading } from '@/components/ui/heading'

export const MedDetail = () => {
  const [showModal, setShowModal] = useState<string | null>(null)
  const { med: medString } = useLocalSearchParams()
  const med = medString ? JSON.parse(medString as string) : null

  if (!med) return <Text>Error: No medication details available.</Text>

  const medImage = medFormActive[med.medForm as MedForm]

  const toggleModal = (modalName: string | null) => setShowModal(modalName)

  const [showAlertDialog, setShowAlertDialog] = React.useState(false)
  const handleClose = () => setShowAlertDialog(false)

  return (
    <SafeAreaView className="h-full bg-amost-primary">
      <VStack space="lg" className="p-6 flex-1">
        <HStack className="justify-between">
          <Pressable onPress={() => router.back()}>
            <Icon as={ArrowLeftIcon} className="stroke-white" size="2xl" />
          </Pressable>

          <Pressable onPress={() => router.push({ pathname: '/editMed', params: { med: JSON.stringify(med) } })}>
            <Icon as={PencilLine} className="stroke-white" size="2xl" /> 
          </Pressable>
        </HStack>
        <ScrollView>
          <VStack space='2xl'>
            {/* PNG Image */}
            <Image source={medImage} size='lg' alt={`${med.medName} image`} className='self-center' />
            
            {/* Medication Title */}
            <Text size='3xl' bold className="text-white text-center">
                {med.medName}
            </Text>

            {/* Frequency and Duration */}
            <HStack space='md' className="justify-between">
              <VStack space='sm' className="flex-1 bg-white rounded-lg p-4">
                <Text bold className="text-amost-secondary-dark_2">Frekuensi</Text>
                <HStack space='sm' className='items-center'>
                  <Icon as={Clock} size='xl' className='stroke-amost-primary' />
                  <Text className="font-semibold text-black">{med.frequency}</Text>
                </HStack>
              </VStack>
              <VStack space='sm' className="flex-1 bg-white rounded-lg p-4">
                <Text bold className="text-amost-secondary-dark_2">Durasi</Text>
                <HStack space='sm' className='items-center'>
                  <Icon as={CalendarRange} size='xl' className='stroke-amost-primary' />
                  <Text className="font-semibold text-black">{med.duration}</Text>
                </HStack>
              </VStack>
            </HStack>

            {/* Intake Schedule */}
            <VStack space='sm'>
              <Text size='lg' className="text-white font-semibold">Jadwal</Text>
              <VStack>
                {med.reminderTimes.map((time: any, index: any) => (
                  <HStack
                    key={index}
                    className={`bg-white rounded-lg p-4 justify-between items-center ${index === med.reminderTimes.length - 1 && index > 0 ? 'mb-0' : 'mb-2'}`}
                  >
                    <Text bold className="text-amost-secondary-dark_2">
                      {`Asupan ke-${index + 1}`}
                    </Text>
                    <Text bold className="text-black">{time}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>

            {/* Medication Info */}
            <VStack space='sm'>
              <Text size='lg' className="text-white font-semibold">Info Obat</Text>
              <HStack className="bg-white rounded-lg p-4 justify-between">
                <Text bold className="text-amost-secondary-dark_2">Dosis</Text>
                <Text bold className="text-black">{med.dosage}</Text>
              </HStack>
              <HStack className="bg-white items-center rounded-lg p-4 justify-between">
                <Text bold className="text-amost-secondary-dark_2">Bentuk Obat</Text>
                <Image size='xs' source={medImage} />
              </HStack>
              <HStack className="bg-white rounded-lg p-4 justify-between">
                <Text bold className="text-amost-secondary-dark_2">Jumlah stok obat</Text>
                <Text bold className="text-black">{med.stockQuantity}</Text>
              </HStack>
            </VStack>

            {/* Detail Obat Section */}
            <VStack space='sm'>
              <Text size='lg' className="text-white font-semibold">Detail Obat</Text>
              <Pressable onPress={() => toggleModal('foto')}>
                <HStack className="bg-white rounded-lg p-4 justify-between items-center">
                  <Text bold className="text-amost-secondary-dark_2">Foto</Text>
                  <Icon as={ChevronRightIcon} size='xl' className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>
              <Pressable onPress={() => toggleModal('instruksi')}>
                <HStack className="bg-white rounded-lg p-4 justify-between items-center">
                  <Text bold className="text-amost-secondary-dark_2">Instruksi</Text>
                  <Icon as={ChevronRightIcon} size='xl' className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>
              <Pressable onPress={() => toggleModal('dokter')}>
                <HStack className="bg-white rounded-lg p-4 justify-between items-center">
                  <Text bold className="text-amost-secondary-dark_2">Dokter yang Meresepkan</Text>
                  <Icon as={ChevronRightIcon} size='xl' className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>
              <Pressable onPress={() => toggleModal('apotek')}>
                <HStack className="bg-white rounded-lg p-4 justify-between items-center">
                  <Text bold className="text-amost-secondary-dark_2">Apotek Pembelian Obat</Text>
                  <Icon as={ChevronRightIcon} size='xl' className="stroke-amost-secondary-dark_2" />
                </HStack>
              </Pressable>
            </VStack>

            {/* Delete Button */}
            <Button onPress={() => setShowAlertDialog(true)} action="negative" className="rounded-full w-full">
              <ButtonText className="font-medium text-white">Hapus</ButtonText>
            </Button>

            <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
              <AlertDialogBackdrop />
              <AlertDialogContent>
                <VStack space='md'>
                  <AlertDialogHeader>
                    <Heading className="text-amost-secondary-dark_1 font-semibold" size="md">
                      Apakah Anda yakin ingin menghapus obat ini?
                    </Heading>
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    <Text size="sm">
                      Menghapus obat akan menghapusnya secara permanen dan tidak dapat dipulihkan.
                    </Text>
                  </AlertDialogBody>
                  <AlertDialogFooter className="">
                    <Button
                      variant="outline"
                      action="secondary"
                      onPress={handleClose}
                      size="sm"
                    >
                      <ButtonText>Batalkan</ButtonText>
                    </Button>
                    <Button size="sm" action="negative" onPress={handleClose}>
                      <ButtonText>Hapus</ButtonText>
                    </Button>
                  </AlertDialogFooter>
                </VStack>
              </AlertDialogContent>
            </AlertDialog>
          </VStack>
        </ScrollView>

        {/* Modal Component */}
        <ModalComponent showModal={showModal} setShowModal={setShowModal} med={med} />
      </VStack>
    </SafeAreaView>
  )
}