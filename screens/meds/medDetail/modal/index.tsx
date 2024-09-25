import React from 'react'
import { Modal, Pressable, View } from 'react-native'
import { Text } from "@/components/ui/text"
import { Image } from "@/components/ui/image"

export const ModalComponent = ({ showModal, setShowModal, med }: { showModal: string | null, setShowModal: (modalName: string | null) => void, med: any }) => (
  <Modal
    visible={showModal !== null}
    transparent={true}
    animationType="none"
    onRequestClose={() => setShowModal(null)}
  >
    <Pressable onPress={() => setShowModal(null)} className="flex-1 justify-center items-center bg-black/50">
      <Pressable>
        <View className="bg-white p-4 rounded-xl w-80 relative">
          {/* Modal Content Based on showModal */}
          {showModal === 'foto' && (
            <>
              <Text className="text-black font-bold my-4 text-center">Foto</Text>
              {med.medPhotos && med.medPhotos.map((photo: any, index: number) => (
                <Image key={index} source={{ uri: photo }} style={{ width: 100, height: 100, marginBottom: 10 }} />
              ))}
            </>
          )}
          {showModal === 'instruksi' && (
            <>
              <Text className="text-black font-bold my-4 text-center">Instruksi Obat</Text>
              <Text className="text-black text-center text-base mb-4">{med.instructions}</Text>
            </>
          )}
          {showModal === 'dokter' && (
            <>
              <Text className="text-black font-bold my-4 text-center">Dokter yang Meresepkan Obat</Text>
              <Text className="text-black text-center text-base mb-4">{med.prescribingDoctor}</Text>
            </>
          )}
          {showModal === 'apotek' && (
            <>
              <Text className="text-black font-bold my-4 text-center">Apotek Tempat Membeli Obat</Text>
              <Text className="text-black text-center text-base mb-4">{med.dispensingPharmacy}</Text>
            </>
          )}
        </View>
      </Pressable>
    </Pressable>
  </Modal>
)
