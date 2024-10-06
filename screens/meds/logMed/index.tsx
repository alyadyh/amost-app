import React, { useEffect, useState } from "react"
import { router } from "expo-router"
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
import { LogMedModal } from "./modal"
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import MedLayout from "../layout"
import { supabase, getCurrentUser, fetchUserProfile } from '@/lib/supabase'
import ShareReport from "./components/ShareExport"

interface GroupedLogs {
  [key: string]: Log[]
}

interface LogWithMedicine extends Log {
  medicines?: Medicine
}

const groupLogsByDate = (logs: LogWithMedicine[]): GroupedLogs => {
  const groups: GroupedLogs = {}
  logs.forEach(log => {
    (groups[log.log_date] = groups[log.log_date] || []).push(log)
  })
  return groups
}

const sortLogsByDate = (groupedLogs: GroupedLogs): [string, LogWithMedicine[]][] => {
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

const getMedNameById = (log: LogWithMedicine) => {
  return log.medicines?.med_name || 'Unknown'
}

const LogCard: React.FC<{ log: LogWithMedicine, onEdit: () => void }> = ({ log, onEdit }) => {
  const medName = getMedNameById(log)
  const borderColor = log.taken === true ? 'border-green-500' : log.taken === false ? 'border-red-500' : 'border-gray-400'
  const iconColor = log.taken === true ? 'text-green-500 stroke-green-500' : log.taken === false ? 'text-red-500 stroke-red-500' : 'text-gray-400 stroke-gray-400'
  const IconComponent = log.taken === true ? CheckCircle : log.taken === false ? XCircle : Circle

  const formattedTime = log.log_time ? log.log_time.slice(0, 5) : "00:00"
  
  const displayText = log.taken === true
    ? `Diminum pada pukul ${formattedTime}`
    : log.taken === false
    ? "Tidak diminum"
    : "Belum ada status log"

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

const LogMedScreen = () => {
  const [userName, setUserName] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null)
  const [selectedReminderTime, setSelectedReminderTime] = useState<string>()
  const [logs, setLogs] = useState<LogWithMedicine[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<LogWithMedicine | null>(null) // New state

  const fetchProfile = async () => {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (userId) {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single()

      if (!error && profileData) {
        setUserName(profileData.full_name || 'No Name')
      } else {
        console.error("Error fetching profile:", error)
      }
    }
  }

  const fetchLogsWithMedicines = async () => {
    setLoading(true)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user?.id) {
        const { data: logsData, error } = await supabase
          .from('med_logs')
          .select('*, medicines(*)')
          .eq('user_id', sessionData.session.user.id)
          .order('log_date', { ascending: false })

        if (error) {
          console.error('Error fetching logs with medicines:', error.message)
        } else {
          setLogs(logsData || [])
        }
      }
    } catch (error) {
      console.error('Error during fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchLogsWithMedicines()
  }, [])

  const handleOpenModal = async (log: LogWithMedicine) => {
    try {
      const med = log.medicines

      if (med) {
        setSelectedMed(med)
        setSelectedReminderTime(log.reminder_time)
        setSelectedLog(log) // Store the selected log
        setShowModal(true)
      } else {
        console.error("Medicine not found in log", log)
      }
    } catch (error) {
      console.error("Error opening modal:", error)
    }
  }

  const handleLogUpdate = (updatedLog: LogWithMedicine) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === updatedLog.id
          ? { ...updatedLog, medicines: updatedLog.medicines || log.medicines }
          : log
      )
    )
    setShowModal(false)
  }

  const groupedLogs = groupLogsByDate(logs)
  const sortedLogs = sortLogsByDate(groupedLogs)

  return (
    <VStack space="3xl">
      <HStack className="items-center justify-between">
        <HStack space="md" className="items-center">
          <Pressable onPress={() => router.back()}>
            <Icon as={ArrowLeftIcon} size="2xl" className="text-amost-secondary-dark_1" />
          </Pressable>
          <Heading size="2xl" className="text-amost-secondary-dark_1 font-black">Log</Heading>
        </HStack>
        <ShareReport userName={userName} />
      </HStack>

      <ScrollView className="mb-12">
        {sortedLogs.map(([date, logs]: [string, LogWithMedicine[]]) => (
          <VStack key={date} space="md" className="mb-6">
            <Text size="lg" bold className="text-amost-secondary-dark_1">
              {getDisplayDate(date)}
            </Text>
            {logs.map((log) => (
              <LogCard key={log.id} log={log} onEdit={() => handleOpenModal(log)} />
            ))}
          </VStack>
        ))}
      </ScrollView>
      {selectedMed && selectedLog && (
        <LogMedModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          medicine={selectedMed}
          reminderTime={selectedReminderTime || "00:00"}
          logDate={selectedLog.log_date} // Pass the correct log date
          onLog={handleLogUpdate}
        />
      )}
    </VStack>
  )
}

export const LogMed = () => {
  return (
    <MedLayout>
      <LogMedScreen />
    </MedLayout>
  )
}
