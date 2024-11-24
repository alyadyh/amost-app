import React, { useState } from 'react'
import { Modal, Pressable, View, ActivityIndicator } from 'react-native'
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"
import { VStack } from '@/components/ui/vstack'

export const ModalComponent = ({ showModal, setShowModal, med }: { showModal: string | null, setShowModal: (modalName: string | null) => void, med: any }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
  <Modal
    visible={showModal !== null}
    transparent={true}
    animationType="none"
    onRequestClose={() => setShowModal(null)}
  >
    <Pressable onPress={() => setShowModal(null)} className="flex-1 justify-center items-center bg-black/50">
      <Pressable>
        <View className="bg-white p-6 rounded-xl items-center w-80 relative">
          {/* Modal Content Based on showModal */}
          {showModal === 'foto' && (
            <VStack space='lg' className="items-center">
              <Text className="text-black font-bold">Foto</Text>
              {med.med_photos ? (
                <>
                    {isLoading && (
                      <ActivityIndicator size="large" color="#000" className="self-center" />
                    )}
                    <Image
                      source={{ uri: med.med_photos }}
                      className="w-64 h-64"
                      alt={`${med.med_name} photo`}
                      onLoadStart={() => setIsLoading(true)} // Start spinner
                      onLoad={() => setIsLoading(false)} // Stop spinner
                    />
                  </>
              ) : (
                <Text className="text-black">Tidak ada foto obat</Text> // Fallback message
              )}
            </VStack>
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
