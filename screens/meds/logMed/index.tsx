import React, { useState } from "react"
import { router } from "expo-router"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Pressable } from "@/components/ui/pressable"
import { ArrowLeftIcon, Icon } from "@/components/ui/icon"
import { Heading } from "@/components/ui/heading"
import { CheckCircle, Circle, PencilLine, Share2, XCircle } from "lucide-react-native"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Medicine, Log } from '@/constants/types'
import { dummyMeds, dummyLogs } from '@/data/dummy'
import { LogModal } from "./modal"
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

type Section = {
  date: string
  logs: Log[]
}

interface GroupedLogs {
  [key: string]: Log[]
}

const groupLogsByDate = (logs: Log[]): GroupedLogs => {
  const groups: GroupedLogs = {}
  logs.forEach(log => {
    (groups[log.date] = groups[log.date] || []).push(log)
  })
  return groups
}

const sortLogsByDate = (groupedLogs: GroupedLogs): [string, Log[]][] => {
  return Object.entries(groupedLogs).sort(([dateA], [dateB]) => {
    return parseISO(dateB).getTime() - parseISO(dateA).getTime() // Newest to oldest
  })
}

const getDisplayDate = (dateString: string): string => {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Hari ini'
  if (isYesterday(date)) return 'Kemarin'
  return format(date, 'dd MMMM yyyy', { locale: id })
}

const getMedNameById = (id: string) => {
  const med = dummyMeds.find(med => med.id === id)
  return med ? med.medName : 'Unknown'
}

const LogCard: React.FC<{ log: Log, onEdit: () => void }> = ({ log, onEdit }) => {
  const medName = getMedNameById(log.id)
  const borderColor = log.taken === true ? 'border-green-500' : log.taken === false ? 'border-red-500' : 'border-gray-400'
  const iconColor = log.taken === true ? 'text-green-500 stroke-green-500' : log.taken === false ? 'text-red-500 stroke-red-500' : 'text-gray-400 stroke-gray-400'
  const IconComponent = log.taken === true ? CheckCircle : log.taken === false ? XCircle : Circle

  // Conditional text based on the log.taken status
  const displayText = log.taken === true
    ? `Diminum pada pukul ${log.time}`
    : log.taken === false
    ? "Belum diminum"
    : "Tidak ada status log"

  return (
    <HStack
      space="sm"
      className={`items-center justify-between p-3 bg-white rounded-lg shadow border-2 ${borderColor}`}
    >
      <HStack space="lg" className="items-center">
        <Icon as={IconComponent} size="lg" className={iconColor} />
        <VStack className="items-left">
          <Text bold className="text-amost-secondary-dark_1">{medName}</Text>
          <Text size="sm" className="text-amost-secondary-dark_2">{displayText}</Text>
        </VStack>
      </HStack>

      <Button size="lg" variant="link" className="rounded-full p-3.5" onPress={onEdit}>
        <ButtonIcon as={PencilLine} className="stroke-amost-secondary-dark_1" />
      </Button>
    </HStack>
  )
}

export const LogMed = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null)
  const groupedLogs = groupLogsByDate(dummyLogs)
  const sortedLogs = sortLogsByDate(groupedLogs)

  const handleOpenModal = (log: Log) => {
    const med = dummyMeds.find(m => m.id === log.id) // Find the medicine by id
    if (med) {
      setSelectedMed(med)
      setShowModal(true)
    }
  }

  const handleLog = (log: Log) => {
    console.log("Log received in LogMed component:", log)
    // Additional logging or state updates here
    setShowModal(false)
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <VStack space="3xl" className="px-6 py-16">
        <HStack className="items-center justify-between">
          <HStack space="md" className="items-center">
            <Pressable onPress={() => router.back()}>
              <Icon as={ArrowLeftIcon} size="2xl" className="text-amost-secondary-dark_1" />
            </Pressable>
            <Heading size="2xl" className="text-amost-secondary-dark_1 font-black">Log</Heading>
          </HStack>
          <Icon as={Share2} size='2xl' className='stroke-amost-secondary-dark_1' />
        </HStack>

        <ScrollView className="mb-12">
          {sortedLogs.map(([date, logs]: [string, Log[]]) => (
            <VStack key={date} space="md" className="mb-6">
              <Text size="lg" bold className="text-amost-secondary-dark_1">
                {getDisplayDate(date)}
              </Text>
              {logs.map((log, index) => (
                <LogCard key={index} log={log} onEdit={() => handleOpenModal(log)} />
              ))}
            </VStack>
          ))}
        </ScrollView>
      </VStack>
      {selectedMed && (
        <LogModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          medicine={selectedMed}
          onLog={handleLog}
        />
      )}
    </SafeAreaView>
  )
}
