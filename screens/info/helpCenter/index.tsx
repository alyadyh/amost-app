import React, { useState } from "react"
import { VStack } from "@/components/ui/vstack"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Accordion, AccordionContent, AccordionContentText, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from "@/components/ui/accordion"
import { Divider } from "@/components/ui/divider"
import { InfoLayout } from "../layout"
import { HStack } from "@/components/ui/hstack"
import { router } from "expo-router"
import { Pressable, ScrollView } from "react-native"
import { ArrowLeftIcon, Icon } from "@/components/ui/icon"
import { ChevronDown } from "lucide-react-native"

export const HelpCenter = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const faqData = [
    {
      question: "Bagaimana cara membuat pengingat obat?",
      answer:
        "Untuk membuat pengingat obat, buka halaman Obatku, klik 'Tambah Obat', isi detail obat, dan simpan.",
    },
    {
      question: "Apa yang harus saya lakukan jika saya lupa kata sandi?",
      answer:
        "Anda dapat menggunakan fitur 'Lupa Kata Sandi' di halaman masuk untuk mereset kata sandi Anda. Kami akan mengirimkan tautan ke email Anda.",
    },
    {
      question: "Bagaimana cara mengubah profil saya?",
      answer:
        "Untuk mengubah profil, buka halaman Profil, klik 'Edit Profil', lakukan perubahan, lalu simpan.",
    },
    {
      question: "Apakah data saya aman di AMOST?",
      answer:
        "Ya, data Anda dilindungi. Namun, kami menyarankan Anda untuk menjaga kerahasiaan akun Anda.",
    },
  ]

  const handleValueChange = (values: string[]) => {
    setExpandedItems(values);
  };

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
            Pusat Bantuan
          </Heading>
        </HStack>
        <ScrollView>
          <Text size="md" className="mb-6 text-amost-secondary-dark_1">
            Selamat datang di Pusat Bantuan AMOST. Temukan jawaban atas pertanyaan umum atau hubungi kami untuk bantuan lebih lanjut.
          </Text>
          <Divider className="mb-6" />

          {/* FAQ Section */}
          <VStack space="lg">
            <Accordion value={expandedItems} onValueChange={handleValueChange}>
              {faqData.map((faq, index) => {
                const value = `item-${index}`;
                return (
                  <AccordionItem key={index} value={value}>
                    <AccordionHeader>
                      <AccordionTrigger className="flex-row justify-between items-center">
                        <AccordionTitleText>{faq.question}</AccordionTitleText>
                        <AccordionIcon
                          as={ChevronDown}
                          className="transition-transform"
                          style={{
                            transform: [{ rotate: expandedItems.includes(value) ? "180deg" : "0deg" }],
                          }}
                        />
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                      <AccordionContentText>{faq.answer}</AccordionContentText>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </VStack>

          {/* Contact Section */}
          <Box className="mt-8 p-4 border rounded-xl border-border-300 bg-light">
            <Heading size="md" className="text-amost-secondary-dark_1 mb-2">
              Masih Membutuhkan Bantuan?
            </Heading>
            <Text className="text-sm text-amost-secondary-dark_2 mb-4">
              Jika Anda tidak menemukan jawaban atas pertanyaan Anda, hubungi kami:
            </Text>
            <Text className="text-sm text-amost-secondary-dark_2">
              Email: <Text bold className="text-amost-primary">amostcare@gmail.com</Text>
            </Text>
          </Box>
        </ScrollView>
    </VStack>
    </InfoLayout>
  )
}
