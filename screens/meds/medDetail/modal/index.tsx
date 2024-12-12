// Core dependencies
import React from 'react'

// Components
import { Modal } from 'react-native'
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"
import { VStack } from '@/components/ui/vstack'
import { Skeleton } from '@/components/ui/skeleton'
import { Box } from '@/components/ui/box'
import { Pressable } from '@/components/ui/pressable'
import { View } from '@/components/ui/view'

export const ModalComponent = ({ showModal, setShowModal, med }: { showModal: string | null, setShowModal: (modalName: string | null) => void, med: any }) => {
  return (
  <Modal
    visible={showModal !== null}
    transparent={true}
    animationType="none"
    onRequestClose={() => setShowModal(null)}
  >
    <Pressable onPress={() => setShowModal(null)} className="flex-1 justify-center items-center bg-black/50">
      <Pressable>
        <View className="bg-white p-6 rounded-xl items-center w-80">
          {/* Modal Content Based on showModal */}
          {showModal === 'foto' && (
            <Box className="items-center">
              <Text className="text-black font-bold">Foto</Text>
              {med.med_photos ? (
                <View>
                  <Skeleton variant="rounded" className="w-64 h-64" />
                  <Image
                    source={{ uri: med.med_photos }}
                    className="absolute inset-0 w-64 h-64"
                    alt={`${med.med_name} photo`}
                   />
                </View>
              ) : (
                <Text className="text-black">Tidak ada foto obat</Text> // Fallback message
              )}
            </Box>
          )}
          {showModal === 'instruksi' && (
            <VStack space='lg' className="items-center">
              <Text className="text-black font-bold">Instruksi Obat</Text>
              <Text className="text-black text-base">
                {med.instructions || "Tidak ada instruksi obat"}
              </Text>
            </VStack>
          )}
          {showModal === 'dokter' && (
            <VStack space='lg' className="items-center">
              <Text className="text-black font-bold">Dokter yang Meresepkan Obat</Text>
              <Text className="text-black text-base">
                {med.prescribing_doctor || "Tidak ada informasi dokter"}
              </Text>
            </VStack>
          )}
          {showModal === 'apotek' && (
            <VStack space='lg' className="items-center">
              <Text className="text-black font-bold">Apotek Tempat Membeli Obat</Text>
              <Text className="text-black text-base">
                {med.dispensing_pharmacy || "Tidak ada informasi apotek"}
              </Text>
            </VStack>
          )}
        </View>
      </Pressable>
    </Pressable>
  </Modal>
  )
}
