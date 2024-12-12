// Core dependencies
import React from "react"
import { router } from "expo-router"

// Components
import { VStack } from "@/components/ui/vstack"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Pressable } from "@/components/ui/pressable"
import { ScrollView } from "@/components/ui/scroll-view"
import { Icon, ArrowLeftIcon } from "@/components/ui/icon"

// Layout
import { InfoLayout } from "../layout"

export const PrivacyPolicy = () => {
  return (
    <InfoLayout>
      <VStack space="3xl" className="flex-1">
        <HStack space="md" className="items-center">
          <Pressable
            onPress={() => {
              router.back()
            }}
          >
            <Icon as={ArrowLeftIcon} className="text-amost-secondary-dark_1" size="2xl" />
          </Pressable>
          <Heading size="2xl" className="text-amost-primary font-black">
            Kebijakan Privasi
          </Heading>
        </HStack>
        <ScrollView>
          <Text size="md" className="mb-6 text-amost-secondary-dark_1" style={{ textAlign: 'justify' }}>
            Terima kasih telah menggunakan <Text bold>AMOST</Text>, aplikasi pengingat obat Anda. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
          </Text>
          <VStack space="4xl">
            {/* Section 1 */}
            <VStack space="sm">
              <Heading size="md" className="text-amost-secondary-dark_1">
                Informasi yang Kami Kumpulkan
              </Heading>
              <Text size="sm" className="text-amost-secondary-dark_2" style={{ textAlign: 'justify' }}>
                Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan pengingat obat Anda. Kami juga dapat mengumpulkan data penggunaan aplikasi untuk meningkatkan layanan kami.
              </Text>
            </VStack>

            {/* Section 2 */}
            <VStack space="sm">
              <Heading size="md" className="text-amost-secondary-dark_1">
                Cara Kami Menggunakan Informasi Anda
              </Heading>
              <Text size="sm" className="text-amost-secondary-dark_2" style={{ textAlign: 'justify' }}>
                Informasi Anda digunakan untuk menyediakan layanan, seperti mengelola pengingat obat, mempersonalisasi pengalaman Anda, dan meningkatkan performa aplikasi.
              </Text>
            </VStack>

            {/* Section 3 */}
            {/* <VStack space="sm">
              <Heading size="md" className="text-amost-secondary-dark_1">
                Keamanan Data Anda
              </Heading>
              <Text size="sm" className="text-amost-secondary-dark_2" style={{ textAlign: 'justify' }}>
                Kami menggunakan teknologi keamanan terbaru untuk melindungi data Anda dari akses yang tidak sah. Namun, kami tidak dapat menjamin keamanan penuh karena sifat internet.
              </Text>
            </VStack> */}

            {/* Section 4 */}
            <VStack space="sm">
              <Heading size="md" className="text-amost-secondary-dark_1">
                Hak Anda
              </Heading>
              <Text size="sm" className="text-amost-secondary-dark_2" style={{ textAlign: 'justify' }}>
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda. Untuk melakukannya, silakan hubungi kami di <Text size="sm" bold italic>amostcare@gmail.com</Text>.
              </Text>
            </VStack>

            {/* Section 5 */}
            <VStack space="sm">
              <Heading size="md" className="text-amost-secondary-dark_1">
                Perubahan Kebijakan Privasi
              </Heading>
              <Text size="sm" className="text-amost-secondary-dark_2" style={{ textAlign: 'justify' }}>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda jika ada perubahan besar melalui aplikasi atau email.
              </Text>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </InfoLayout>
  )
}
