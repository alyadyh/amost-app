// Core dependencies
import React from "react"
import { router } from "expo-router"
import { Pressable, ScrollView } from "react-native"

// Components
import { VStack } from "@/components/ui/vstack"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Divider } from "@/components/ui/divider"
import { HStack } from "@/components/ui/hstack"
import { Icon, ArrowLeftIcon } from "@/components/ui/icon"
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Icons
import { ChevronUp, ChevronDown } from "lucide-react-native"

// Layout
import { InfoLayout } from "../layout"

export const HelpCenter = () => {
  const faqData = [
    {
      question: "Bagaimana cara membuat pengingat obat?",
      answer:
        "Untuk membuat pengingat obat, buka halaman Obatku, klik 'Tambah Obat', isi detail obat, dan simpan.",
    },
    // {
    //   question: "Apa yang harus saya lakukan jika saya lupa password?",
    //   answer:
    //     "Anda dapat menggunakan fitur 'Lupa Password' di halaman masuk untuk mereset password Anda. Kami akan mengirimkan tautan ke email Anda.",
    // },
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
          <Text className="mb-6 text-amost-secondary-dark_1">
            Selamat datang di Pusat Bantuan <Text bold>AMOST</Text>. Temukan jawaban atas pertanyaan umum atau hubungi kami untuk bantuan lebih lanjut.
          </Text>
          {/* <Divider /> */}

          {/* FAQ Section */}
          <VStack space="lg">
            <Accordion size="md" variant="filled" type="single" isCollapsible>
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }) => (
                        <HStack className="flex-row justify-between items-center">
                          <AccordionTitleText>{faq.question}</AccordionTitleText>
                          <AccordionIcon as={isExpanded ? ChevronUp : ChevronDown} className="ml-3" />
                        </HStack>
                      )}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>
                    <AccordionContentText>{faq.answer}</AccordionContentText>
                  </AccordionContent>
                  {index < faqData.length - 1 && <Divider />}
                </AccordionItem>
              ))}
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
